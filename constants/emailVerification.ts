export const emailText = (verifyUrl: string, name: string) => `
            <div>
                <h1>Welcome, ${name} </h1>
                <p>Here is your verifying link:</p>
                <a href="${verifyUrl}">Click here</a>
                <p>This link is valid for 24 hours.</p>
                <h2>Kind Regards, Job Applications team</h2>
            </div>`;
