"use client";

import { useRouter } from "next/navigation";
import LoadManagementForm from "@/components/LoadManagementForm";
import { useAuth } from "@/context/AuthContext";

export default function CreateLoadPage() {
    const router = useRouter();
    const user = useAuth((state) => state.user);

    const todayStr = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    if (!user || (user.role !== "Admin" && user.role !== "Dispatcher")) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1 className="text-white">Unauthorized</h1>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0 animate-fade-in" style={{ maxWidth: "1600px" }}>
            {/* DASHBOARD HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
                <div className="text-start">
                    <h1
                        className="display-6 fw-black text-white m-0 tracking-tight"
                        style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.04em" }}
                    >
                        <span className="text-gradient-emerald">
                            {user?.role || "User"}
                        </span>{" "}
                        Dashboard
                    </h1>
                    <p
                        className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.7rem" }}
                    >
                        {todayStr}
                    </p>
                </div>
            </div>

            <div className="container pt-2 pb-4 animate-fade-in">
                <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="mb-3 text-start">
                        <h2 className="fs-2 fw-black text-white m-0 tracking-tight" style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.03em" }}>
                            CREATE NEW <span className="text-gradient-emerald">LOAD</span>
                        </h2>
                    </div>

                    <div className="glass-card-stitch p-4 p-md-5 rounded-5 border border-white border-opacity-10 shadow-2xl" style={{ background: "rgba(8, 10, 15, 0.4)" }}>
                        <LoadManagementForm 
                            onSubmitSuccess={() => router.push("/dashboard")}
                            onCancel={() => router.push("/dashboard")}
                        />
                    </div>
                </div>
            </div>
            </div>
            <style jsx>{`
                .text-gradient-emerald {
                    background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .fw-black { font-weight: 900; }
                .tracking-tight { letter-spacing: -0.04em; }
            `}</style>
        </div>
    );
}
