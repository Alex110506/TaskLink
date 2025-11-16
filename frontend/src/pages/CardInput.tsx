import React, { useState, ChangeEvent, FormEvent } from "react";
// Added icons to match the premium theme
import { Sparkles, CreditCard, Shield, Info } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Interface for the form data
interface PaymentFormData {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    postalCode: string;
}

export default function SubscriptionPaymentForm() {
    const navigate=useNavigate()
    const [formData, setFormData] = useState<PaymentFormData>({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        postalCode: "",
    });

    const { toast } = useToast()

    const { user } = useAuthStore()

    const [isProcessing, setIsProcessing] = useState(false);

    // --- Formatting Logic ---
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const parts = [];
        for (let i = 0; i < v.length; i += 4) parts.push(v.substring(i, i + 4));
        return parts.join(" ");
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\D/g, "");
        if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        return v;
    };

    // --- Handlers ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") formattedValue = formatCardNumber(value);
        if (name === "expiry") formattedValue = formatExpiry(value);
        if (name === "cvc") formattedValue = value.replace(/\D/g, "").slice(0, 4);

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsProcessing(false);
        // TODO: Replace alert with a toast notification
        console.log("Subscription started successfully!");
    };

    const handlePayment = () => {

        if (
            !formData.cardName.trim() ||
            !formData.cardNumber.trim() ||
            !formData.expiry.trim() ||
            !formData.cvc.trim() ||
            !formData.postalCode.trim()
        ) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            }); return;
        }

        // optional deeper validation
        if (formData.cardNumber.length < 12) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            }); return;
        }

        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            }); return;
        }

        if (formData.cvc.length < 3) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            }); return;
        }

        // Safety check to ensure user is logged in
        if (!user?.email) return;

        // 1. Get existing subscriptions from local storage
        const existingData = localStorage.getItem("subscription");

        // 2. Parse existing data (default to empty array if null)
        const currentSubscriptions = existingData ? JSON.parse(existingData) : [];

        // 3. Filter out the current user if they already exist (to avoid duplicates)
        const otherUsers = currentSubscriptions.filter((sub: any) => sub.email !== user.email);

        // 4. Create the new subscription object
        const newSubscription = {
            email: user.email,
            isSubscribed: true
        };

        // 5. Add the new subscription to the array and save back to string
        const updatedList = [...otherUsers, newSubscription];
        localStorage.setItem("subscription", JSON.stringify(updatedList));

        // Optional: Visual feedback
        toast({
            title: "Subscription payed",
            description:"Payment successful! You are now a Pro member."
        });
        setTimeout(()=>{
            navigate("/")
        },1000)

    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-blue-900/10 p-4">
            {/* Card Container - Themed to match Pro cards */}
            <div className="relative w-full max-w-md rounded-xl border border-primary/50 bg-gradient-to-br from-background to-primary/5 shadow-xl shadow-primary/10">

                {/* Floating Sparkle Effect */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Sparkles className="h-32 w-32 text-primary" />
                </div>

                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground">
                            Payment Details
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete your purchase for{" "}
                            <span className="font-medium text-primary">
                                Pro Subscription
                            </span>
                            .
                        </p>

                        <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 p-4 text-foreground backdrop-blur-md">
                            <span className="font-semibold">Total due today</span>
                            <span className="text-lg font-bold">$29.00</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Cardholder */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-1 block">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                name="cardName"
                                placeholder="John Doe"
                                value={formData.cardName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Card Number */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-1 block">
                                Card Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    maxLength={19}
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Expiry */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                                    Expiry
                                </label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* CVC */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    name="cvc"
                                    placeholder="123"
                                    maxLength={4}
                                    value={formData.cvc}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* ZIP */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                                    ZIP
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="10001"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300
                bg-gradient-to-r from-primary via-blue-600 to-accent shadow-primary/30 hover:shadow-primary/50 hover:opacity-90
                ${isProcessing ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                            onClick={() => handlePayment()}
                        >
                            {isProcessing ? "Processing..." : "Pay $29.00"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
                        Secure payment processing.
                    </p>
                </div>
            </div>
        </div>
    );
}