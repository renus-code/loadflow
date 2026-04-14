"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  Control,
  useWatch,
  UseFormRegister,
} from "react-hook-form";
import { ILoad, IStop } from "@/models/Load";
import { StateProvinceSelect, CitySelect } from "@/components/LocationSelects";

const FIELD =
    "form-control rounded-4 p-3 glass-input-premium text-white shadow-sm focus-ring-emerald transition-all border-white border-opacity-10 shadow-none";

interface SelectOption {
    value: string;
    label: string;
}

function GlassySelect({
    options,
    value,
    onChange,
    id,
}: {
    options: SelectOption[];
    value: string;
    onChange: (v: string) => void;
    id?: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="position-relative w-100">
            <button
                type="button"
                id={id}
                className="form-select form-select-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none w-100 text-start d-flex justify-content-between align-items-center"
                style={{
                    background: "#0d1117",
                    color: "white",
                    backgroundImage: "none",
                }}
                onClick={() => setOpen(!open)}
            >
                <span className="fw-bold">
                    {options.find((o) => o.value === value)?.label || "Select..."}
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        opacity: 0.8,
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        color: "#2bdd66",
                    }}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {open && (
                <ul
                    className="list-unstyled position-absolute w-100 border border-white border-opacity-10 rounded-4 shadow-2xl mt-1 py-1"
                    style={{
                        zIndex: 9999,
                        maxHeight: "250px",
                        overflowY: "auto",
                        background: "#05070a",
                    }}
                >
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                className={`btn btn-link text-decoration-none w-100 text-start px-3 py-2 small fw-medium hover-bg-white-5 ${
                                    value === opt.value ? "text-emerald fw-black" : "text-white"
                                }`}
                                onMouseDown={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function LocationBlock({
    type,
    index,
    control,
    register,
    onRemove,
    isRemovable,
}: {
    type: "pickups" | "deliveries";
    index: number;
    control: Control<LoadFormData>;
    register: UseFormRegister<LoadFormData>;
    onRemove: () => void;
    isRemovable: boolean;
}) {
    const isPickup = type === "pickups";
    const prefix = `${type}.${index}` as const;

    const stateCode = useWatch({
        control,
        name: `${prefix}.state`,
    });

    return (
        <div
            className={`shadow-sm rounded-4 p-4 stop-card h-100 position-relative transition-all`}
            style={{
                borderLeft: `6px solid ${isPickup ? "#6366f1" : "#10b981"}`,
                background: "#0b101f",
                border: "1px solid rgba(255,255,255,0.05) !important",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span
                    className="badge rounded-pill fw-bold px-3 py-2 border shadow-sm stop-label d-flex align-items-center gap-2"
                    style={{
                        background: isPickup
                            ? "rgba(99, 102, 241, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color: isPickup ? "#818cf8" : "#34d399",
                        border: `1px solid ${isPickup ? "rgba(99, 102, 241, 0.3)" : "rgba(16, 185, 129, 0.3)"} !important`,
                    }}
                >
                    {type === "pickups" ? "📦 PICKUP" : "🚚 DELIVERY"} #{index + 1}
                </span>
                {isRemovable && (
                    <button
                        type="button"
                        className="btn btn-link text-danger p-0 text-decoration-none opacity-50 hover-opacity-100 transition-all"
                        onClick={onRemove}
                        title="Remove Stop"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="d-flex flex-column gap-3">
                <div className="row g-3">
                    <div className="col-12">
                        <label
                            htmlFor={`${prefix}.companyName`}
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest"
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                            id={`${prefix}.companyName`}
                            required
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="e.g. Walmart DC, Global Logistics"
                            {...register(`${prefix}.companyName`, { required: true })}
                        />
                    </div>
                    <div className="col-12">
                        <label
                            htmlFor={`${prefix}.address`}
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest"
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Address <span className="text-danger">*</span>
                        </label>
                        <input
                            id={`${prefix}.address`}
                            required
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="123 Industrial Way"
                            {...register(`${prefix}.address`, { required: true })}
                        />
                    </div>
                    <div className="col-md-6">
                        <label
                            htmlFor={`${prefix}.state`}
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest"
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            State / Province <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name={`${prefix}.state`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <StateProvinceSelect
                                    id={`${prefix}.state`}
                                    value={field.value}
                                    className={FIELD}
                                    style={{ background: "#0d1117", color: "white" }}
                                    onChange={(v: string) => {
                                        field.onChange(v);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="col-md-6">
                        <label
                            htmlFor={`${prefix}.city`}
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest"
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            City <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name={`${prefix}.city`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <CitySelect
                                        id={`${prefix}.city`}
                                        stateCode={stateCode}
                                        value={field.value}
                                        className={FIELD}
                                        style={{ background: "#0d1117", color: "white" }}
                                        onChange={field.onChange}
                                    />
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-5">
                        <label 
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest" 
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Postal Code <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="M5V 2L7"
                            {...register(`${prefix}.postalCode`, { required: true })}
                        />
                    </div>
                    <div className="col-md-7">
                        <label 
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest" 
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Appointment Number <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="A-998811"
                            {...register(`${prefix}.appointmentNumber`, { required: true })}
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-7">
                        <label 
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest" 
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Date <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            type="date"
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            {...register(`${prefix}.date`, { required: true })}
                        />
                    </div>
                    <div className="col-md-5">
                        <label 
                            className="fw-black mb-1 px-1 text-uppercase tracking-widest" 
                            style={{ 
                                fontSize: "10.5px", 
                                color: isPickup ? "#818cf8" : "#2bdd66",
                                letterSpacing: "1px"
                            }}
                        >
                            Time <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            type="time"
                            className={FIELD}
                            style={{ background: "#0d1117", color: "white" }}
                            {...register(`${prefix}.time`, { required: true })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

type FormStop = Omit<IStop, "date" | "status"> & {
    date: string;
    status: "PENDING" | "PICKED_UP" | "DELIVERED";
};

type LoadFormData = {
    loadNumber: string;
    commodity: string;
    pickups: FormStop[];
    deliveries: FormStop[];
    quantity: string;
    quantityUnit: string;
    weight: string;
    weightUnit: string;
};

interface LoadManagementFormProps {
    initialData?: ILoad;
    onSubmitSuccess: () => void;
    onCancel: () => void;
}

export default function LoadManagementForm({
    initialData,
    onSubmitSuccess,
    onCancel,
}: LoadManagementFormProps) {
    const isEdit = !!initialData;
    const initialStop = useMemo<FormStop>(
        () => ({
            companyName: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            appointmentNumber: "",
            date: new Date().toISOString().split("T")[0],
            time: "",
            status: "PENDING",
        }),
        [],
    );

    const { register, handleSubmit, control, reset } = useForm<LoadFormData>({
        defaultValues: {
            loadNumber: "",
            commodity: "",
            pickups: [{ ...initialStop }],
            deliveries: [{ ...initialStop }],
            quantity: "",
            quantityUnit: "pallets",
            weight: "",
            weightUnit: "lbs",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                loadNumber: initialData.loadNumber,
                commodity: initialData.commodity || "",
                pickups: initialData.pickups.map((p) => ({
                    ...p,
                    date: new Date(p.date).toISOString().split("T")[0],
                })) as FormStop[],
                deliveries: initialData.deliveries.map((d) => ({
                    ...d,
                    date: new Date(d.date).toISOString().split("T")[0],
                })) as FormStop[],
                quantity: initialData.quantity.toString(),
                quantityUnit: initialData.quantityUnit,
                weight: initialData.weight.toString(),
                weightUnit: initialData.weightUnit,
            });
        }
    }, [initialData, reset]);

    const {
        fields: pickupFields,
        append: appendPickup,
        remove: removePickup,
    } = useFieldArray({ control, name: "pickups" });
    const {
        fields: deliveryFields,
        append: appendDelivery,
        remove: removeDelivery,
    } = useFieldArray({ control, name: "deliveries" });

    const onSubmit = async (data: LoadFormData) => {
        try {
            const url = isEdit ? `/api/loads/${initialData._id}` : "/api/loads";
            const method = isEdit ? "PUT" : "POST";

            // Calculate Transit Time based on first pickup and last delivery
            let estimatedDuration = 0;
            if (data.pickups.length > 0 && data.deliveries.length > 0) {
                const first = data.pickups[0];
                const last = data.deliveries[data.deliveries.length - 1];
                if (first.date && first.time && last.date && last.time) {
                    const start = new Date(`${first.date}T${first.time}`);
                    const end = new Date(`${last.date}T${last.time}`);
                    const diff = end.getTime() - start.getTime();
                    if (diff > 0) {
                        estimatedDuration = Number((diff / (1000 * 60 * 60)).toFixed(1));
                    }
                }
            }

            const payload = {
                ...data,
                quantity: Number(data.quantity),
                weight: Number(data.weight),
                estimatedDuration,
                pickups: data.pickups.map((p) => ({
                    ...p,
                    date: new Date(p.date),
                })),
                deliveries: data.deliveries.map((d) => ({
                    ...d,
                    date: new Date(d.date),
                })),
                __v: isEdit ? initialData?.__v : undefined,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 409) {
                const errData = await res.json();
                alert(
                    errData.error ||
                    "Load has been modified by another user. Please refresh.",
                );
                return;
            }

            if (res.ok) {
                onSubmitSuccess();
            } else {
                const errData = await res.json();
                alert(`Failed to save load: ${errData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Failed to save load:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="row g-5">
            {/* SECTION: GENERAL */}
            <div className="col-12 text-start">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg"
                        style={{ width: "45px", height: "45px" }}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2bdd66"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <h5
                        className="fw-black text-white m-0 text-uppercase tracking-widest"
                        style={{ fontSize: "0.85rem" }}
                    >
                        General Information
                    </h5>
                </div>
                <hr className="mt-2 mb-4 border-white opacity-10" />
                <div className="px-1">
                        <label
                            htmlFor="loadNumberField"
                            className="small fw-bold text-white mb-2 px-1 text-uppercase tracking-widest opacity-80"
                        >
                        Load Reference Number <span className="text-danger">*</span>
                    </label>
                    <input
                        id="loadNumberField"
                        required
                        className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                        style={{ background: "#0d1117", color: "white" }}
                        placeholder="e.g. #LD-882299"
                        {...register("loadNumber", { required: true })}
                    />
                </div>
            </div>

            {/* SECTION: PICKUP */}
            <div className="col-12 text-start">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-indigo"
                            style={{ width: "45px", height: "45px" }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>
                        </div>
                        <h5 className="fw-black text-white m-0 text-uppercase tracking-widest" style={{ fontSize: "0.85rem" }}>
                            Pickup Stations
                        </h5>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-emerald fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-lg transition-all border-0"
                        onClick={() => appendPickup({ ...initialStop })}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        ADD PICKUP
                    </button>
                </div>
                <hr className="mt-2 mb-4 border-white opacity-10" />
                <div className="row g-4">
                    {pickupFields.map((field, idx) => (
                        <div key={field.id} className="col-lg-6">
                            <LocationBlock
                                type="pickups"
                                index={idx}
                                control={control}
                                register={register}
                                onRemove={() => removePickup(idx)}
                                isRemovable={pickupFields.length > 1}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION: DELIVERY */}
            <div className="col-12 mt-4 text-start">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-emerald"
                            style={{ width: "45px", height: "45px" }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <h5 className="fw-black text-white m-0 text-uppercase tracking-widest" style={{ fontSize: "0.85rem" }}>
                            Delivery Terminals
                        </h5>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-emerald fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-lg transition-all border-0"
                        onClick={() => appendDelivery({ ...initialStop })}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        ADD DELIVERY
                    </button>
                </div>
                <hr className="mt-2 mb-4 border-white opacity-10" />
                <div className="row g-4">
                    {deliveryFields.map((field, idx) => (
                        <div key={field.id} className="col-lg-6">
                            <LocationBlock
                                type="deliveries"
                                index={idx}
                                control={control}
                                register={register}
                                onRemove={() => removeDelivery(idx)}
                                isRemovable={deliveryFields.length > 1}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION: CARGO */}
            <div className="col-12 mt-5 text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-orange"
                        style={{ width: "35px", height: "35px" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h5 className="fw-black text-white m-0 text-uppercase tracking-widest" style={{ fontSize: "0.75rem" }}>
                        Logistics Payload
                    </h5>
                </div>
                <hr className="mt-1 mb-3 border-white opacity-10" />
                <div className="row g-3 px-1 mb-3">
                    <div className="col-12">
                        <label
                            htmlFor="commodityField"
                            className="small fw-bold text-white mb-2 px-1 text-uppercase tracking-wider"
                        >
                            Commodity / Load Type <span className="text-danger">*</span>
                        </label>
                        <input
                            id="commodityField"
                            required
                            className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="e.g. Fresh Produce, Steel"
                            {...register("commodity", { required: true })}
                        />
                    </div>
                </div>
                <div className="row g-3 px-1">
                    <div className="col-md-3">
                        <label className="small fw-black text-white mb-2 text-uppercase tracking-widest opacity-80">
                            Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            type="number"
                            min={0}
                            className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="24"
                            {...register("quantity", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="small fw-black text-white mb-2 text-uppercase tracking-wider">
                            Unit <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="quantityUnit"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <GlassySelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "skids", label: "Skids" },
                                        { value: "pallets", label: "Pallets" },
                                        { value: "packages", label: "Packages" },
                                        { value: "pieces", label: "Pieces" },
                                        { value: "box", label: "Box" },
                                        { value: "cases", label: "Cases" },
                                    ]}
                                />
                            )}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="small fw-black text-white mb-2 text-uppercase tracking-wider">
                            Weight <span className="text-danger">*</span>
                        </label>
                        <input
                            required
                            type="number"
                            min={0}
                            className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                            style={{ background: "#0d1117", color: "white" }}
                            placeholder="45000"
                            {...register("weight", { required: true, min: 0 })}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="small fw-black text-white mb-2 text-uppercase tracking-wider">
                            Weight Unit <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="weightUnit"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <GlassySelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "lbs", label: "lbs" },
                                        { value: "kg", label: "kg" },
                                    ]}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 mt-4 pb-2 px-1 d-flex flex-column flex-md-row justify-content-center gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline-secondary rounded-pill py-2 px-5 fw-bold fs-5 transition-all hover-float hover-scale active-scale-95 border-white border-opacity-20 text-white shadow-sm"
                    style={{ minWidth: "180px" }}
                >
                    CANCEL
                </button>
                <button
                    type="submit"
                    className="btn btn-emerald rounded-pill py-2 px-5 fw-bold fs-5 shadow-glow-emerald transition-all hover-float hover-scale active-scale-95 d-flex align-items-center justify-content-center gap-2 border-0"
                    style={{ minWidth: "220px" }}
                >
                    {isEdit ? "UPDATE LOAD" : "DISPATCH LOAD"}
                </button>
            </div>
            <style jsx global>{`
                input::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                }
                .glass-icon-bg {
                    background: rgba(43, 221, 102, 0.1);
                    border: 1px solid rgba(43, 221, 102, 0.2);
                }
                .glass-icon-bg-indigo {
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }
                .glass-icon-bg-emerald {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .glass-icon-bg-orange {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .btn-emerald {
                    background: linear-gradient(135deg, #2bdd66, #10b981) !important;
                    color: white !important;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .btn-emerald:hover {
                    box-shadow: 0 0 30px rgba(43, 221, 102, 0.5) !important;
                    transform: translateY(-3px) scale(1.02) !important;
                    filter: brightness(1.1);
                }
                .btn-emerald:active {
                    transform: scale(0.98) !important;
                }
            `}</style>
        </form>
    );
}
