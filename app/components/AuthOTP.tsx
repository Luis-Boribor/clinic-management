import { FC } from "react";

interface EmailTemplateProps {
    full_name: string;
    otp: string;
}

export const EmailTemplate: FC<EmailTemplateProps> = ({ full_name, otp }) => {
    return (
        <div>
            <header className="mb-5">
                <h1 className="text-2xl font-bold">Welcome, {full_name}!</h1>
            </header>
            <div>
                <p>Your OTP code is: {otp}</p>
            </div>
        </div>
    )
}