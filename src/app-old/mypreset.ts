//mypreset.ts
import { updatePreset } from '@primeuix/themes';
import Lara from '@primeng/themes/lara';

const MyPreset = updatePreset(Lara, {
    semantic: {
        primary: {
            50: "#f5f6f9",
            100: "#d1d4e1",
            200: "#acb2ca",
            300: "#8890b2",
            400: "#636e9b",
            500: "#3f4c83",
            600: "#36416f",
            700: "#2c355c",
            800: "#232a48",
            900: "#191e34",
            950: "#101321"
        },
        secondary: {
            50: "#fef8f3",
            100: "#fbdfc5",
            200: "#f9c597",
            300: "#f6ab6a",
            400: "#f3923c",
            500: "#f0780e",
            600: "#cc660c",
            700: "#a8540a",
            800: "#844208",
            900: "#603006",
            950: "#3c1e04"
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{ gray.50}',
                    100: '{ gray.100}',
                    200: '{ gray.200}',
                    300: '{ gray.300}',
                    400: '{ gray.400}',
                    500: '{ gray.500}',
                    600: '{ gray.600}',
                    700: '{ gray.700}',
                    800: '{ gray.800}',
                    900: '{ gray.900}',
                    950: '{ gray.950}'
                },
                accent: '{secondary.500}',
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                },
                accent: '{secondary.500}',
            }
        }
    }
});

export default MyPreset;