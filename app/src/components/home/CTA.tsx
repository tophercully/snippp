"use client"
import React from "react";
import { useUser } from "@/app/src/contexts/UserContext";
import SnipppButton from "@/app/src/components/universal/SnipppButton";
import { useRouter } from "next/navigation";

const CTA: React.FC = () => {
    const { userProfile, login } = useUser();
    const router = useRouter();
    const SecondaryActionButton = ({ pronounced = false }: { pronounced?: boolean }) => {
        if (userProfile) {
            return (
                <SnipppButton
                    colorType="add"
                    pronounced={pronounced}
                    size="lg"
                    onClick={()=>router.push("/dashboard")}
                >
                    <span className="text-md flex items-center justify-center md:text-xl">
                        Go to Dashboard
                        <img
                            src="dashboard.svg"
                            className="ml-3 h-6 group-hover:invert-0 dark:invert"
                        />
                    </span>
                </SnipppButton>
            );
        } else {
            return (
                <SnipppButton
                    colorType="add"
                    size="lg"
                    pronounced={pronounced}
                    onClick={() => {
                        login();
                        console.log("logging in");
                    }}
                >
                    {"Sign up— it's free :)"}
                </SnipppButton>
            );
        }
    };

    return (
        <div id="CTA" className="z-10 flex items-center gap-4 self-center md:self-end">
            <SecondaryActionButton pronounced={true} />
        </div>
    );
};

export default CTA;