import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signature-pad-wrapper">
      <canvas #signatureCanvas 
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseUp()"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()"
        class="signature-canvas">
      </canvas>
    </div>
  `,
  styles: [`
    .signature-pad-wrapper {
      border: 2px solid #dee2e6;
      border-radius: 4px;
      background-color: #fff;
    }
    .signature-canvas {
      width: 100%;
      height: 200px;
      cursor: crosshair;
      display: block;
    }
  `]
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('signatureCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureChange = new EventEmitter<string | null>();

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size
    this.resizeCanvas();
    
    // Configure drawing style
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  private resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 200;
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  private getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    } else {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    const coords = this.getCoordinates(event);
    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.draw(event);
  }

  onMouseUp() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.emitSignature();
    }
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.isDrawing = true;
    const coords = this.getCoordinates(event);
    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!this.isDrawing) return;
    this.draw(event);
  }

  onTouchEnd() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.emitSignature();
    }
  }

  private draw(event: MouseEvent | TouchEvent) {
    const coords = this.getCoordinates(event);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(coords.x, coords.y);
    this.ctx.stroke();
    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.emitSignature();
  }

  isEmpty(): boolean {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0) {
        return false;
      }
    }
    return true;
  }

  toDataURL(type: string = 'image/png'): string {
    return this.canvas.toDataURL(type);
  }

  private emitSignature() {
    if (this.isEmpty()) {
      this.signatureChange.emit(null);
    } else {
      this.signatureChange.emit(this.toDataURL());
    }
  }
}

