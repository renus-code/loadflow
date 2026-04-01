"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadManagementForm from "@/components/LoadManagementForm";
import { useAuth } from "@/context/AuthContext";
import { ILoad } from "@/models/Load";

export default function EditLoadPage() {
    const router = useRouter();
    const params = useParams();
    const user = useAuth((state) => state.user);
    const [load, setLoad] = useState<ILoad | null>(null);
    const [loading, setLoading] = useState(true);

    const todayStr = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        if (params.id) {
            fetch(`/api/loads/${params.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setLoad(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch load:", err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (!user || (user.role !== "Admin" && user.role !== "Dispatcher")) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1 className="text-white">Unauthorized</h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-emerald" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!load) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 gap-3">
                <h1 className="text-white fw-black">LOAD NOT FOUND</h1>
                <button onClick={() => router.push("/dashboard")} className="btn btn-emerald rounded-pill px-4">BACK TO DASHBOARD</button>
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
                            EDIT <span className="text-gradient-emerald">LOAD</span>
                        </h2>
                    </div>

                    <div className="glass-card-stitch p-4 p-md-5 rounded-5 border border-white border-opacity-10 shadow-2xl" style={{ background: "rgba(8, 10, 15, 0.4)" }}>
                        <LoadManagementForm 
                            initialData={load}
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
