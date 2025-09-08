import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, UserPlus, Lightbulb, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Join & Invite",
      description:
        "Create your board in seconds and invite team members with a simple room name. No complex setup required.",
      highlight: "Instant Setup",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      number: "02",
      icon: Lightbulb,
      title: "Create & Brainstorm",
      description: "Use our intuitive tools to sketch ideas in real-time.",
      highlight: "Real-time Magic",
      color: "from-emerald-500/20 to-teal-500/20",
    },
  ];

  return (
    <section id="process" className="relative py-26 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.secondary.DEFAULT/0.15),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <Badge
            variant="outline"
            className="bg-white/20 border-primary/30 text-primary font-medium"
          >
            <Share2 className="w-4 h-4 mr-2 animate-pulse" />
            The Process
          </Badge>
          <h2 className="text-5xl sm:text-6xl font-bold my-8 tracking-wide">
            Start collaborating in
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              three simple steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            From idea to execution in minutes. Think-Board makes visual
            collaboration as simple as opening a browser.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2 }}
                key={index}
                className="mb-16 last:mb-0"
              >
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60`}
                  />

                  <div className="relative bg-background/50 backdrop-blur-md rounded-3xl p-8 border border-secondary/10 hover:border-secondary/20 transition-all duration-300">
                    <div className="grid md:grid-cols-[150px_1fr] gap-8 items-center">
                      {/* Left: Number & Icon */}
                      <div className="text-center md:text-left">
                        <div className="text-8xl font-bold bg-gradient-to-br from-primary/40 to-secondary/40 bg-clip-text text-transparent mb-4">
                          {step.number}
                        </div>
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:shadow-primary/25 transition-all duration-500">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="space-y-6">
                        <Badge
                          variant="secondary"
                          className="text-sm font-medium px-4 py-1"
                        >
                          {step.highlight}
                        </Badge>
                        <h3 className="text-3xl font-semibold bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/50 rounded-3xl group-hover:blur-xl transition-all duration-500" />
            <div className="relative bg-background/50 backdrop-blur-md rounded-3xl p-12 border border-secondary/10">
              <div className="max-w-3xl mx-auto space-y-8">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Ready to Transform Your Workflow?
                </h3>
                <p className="text-xl text-muted-foreground">
                  Join thousands of teams already using Think-Board to bring
                  their ideas to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-secondary/20 hover:bg-primary/70 transition-colors"
                  >
                    Book a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
