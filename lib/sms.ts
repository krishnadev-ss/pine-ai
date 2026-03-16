export async function sendSMS(phone: string, message: string) {
    const number = phone.replace("+91", "").replace(/\s/g, "");

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
            authorization: process.env.FAST2SMS_API_KEY!,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            route: "q",
            message: message,
            language: "english",
            flash: 0,
            numbers: number,
        }),
    });

    const data = await response.json();
    console.log("SMS response:", data);
    return data;
}