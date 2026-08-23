import { Card, Button } from "@/components/ui/core";
import { Check, Zap } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$10",
      credits: "100",
      features: ["100 Generations", "Daily 30 min limit", "Standard Support"],
    },
    {
      name: "Pro",
      price: "$29",
      credits: "500",
      features: ["500 Generations", "Daily 30 min limit", "Priority Support", "High Quality"],
    },
    {
      name: "Enterprise",
      price: "$99",
      credits: "2000",
      features: ["2000 Generations", "Daily 30 min limit", "24/7 Support", "API Access"],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-zinc-400">Buy credits to start generating professional AI voices.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col border-zinc-800 bg-zinc-900/50">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
              </div>
              <p className="mt-2 text-zinc-400">{plan.credits} Credits included</p>
            </div>
            
            <ul className="mb-8 flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <Check className="h-5 w-5 text-blue-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={plan.name === "Pro" ? "primary" : "outline"}>
              {plan.name === "Pro" ? <Zap className="mr-2 h-4 w-4" /> : null}
              Buy Now
            </Button>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20 text-center">
        <p className="text-sm text-blue-200">
          Note: This is a demo. All generations have a daily limit of 30 minutes to ensure service quality.
        </p>
      </Card>
    </div>
  );
}
