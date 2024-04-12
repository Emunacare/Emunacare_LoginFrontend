import baseUrl from "./service-config.json"

export async function manualLoginService(data) {
    const response = await fetch(baseUrl.local_API + 'manual/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/Json',
        },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function scanIdLoginService(data) {
    const response = await fetch(baseUrl.local_API + 'id-scan/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/Json',
        },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function getComapanyUserEmails(data) {
    const response = await fetch(baseUrl.local_API + `common/get-verified-emails?companyName=${data}`)
    return await response.json();
}


export async function getUserDetails(emaildata,companydata) {
    const response = await fetch(baseUrl.local_API + `common/get-details?email=${emaildata}&companyName=${companydata}`)
    return await response.json();
}