const dev_domain = "api.uniprep.ai";
const prod_domain = "uniprep.ai";
const staging_domain = "admin-staging.uniprep.ai"
const staging_api_url = "api-staging.uniprep.ai"
const dev_url = `https://${dev_domain}/uniprepapi/public/api`;
const prod_url = `https://${prod_domain}/uniprepapi/public/api`;
const staging_url = `https://${staging_api_url}/api`;
export const environment = {
    domain: staging_domain,
    maintenanceMode: false,
    production: true,
    ApiUrl: staging_url,
    EmployerApiUrl: `${staging_url}/employer`,
    tokenKey: "token",
};
