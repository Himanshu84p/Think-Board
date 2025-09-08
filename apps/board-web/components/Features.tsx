import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Infinity,
  Zap,
  Image,
  Shield,
  Palette,
  MousePointer,
  Cloud,
} from "lucide-react";
import { motion } from "framer-motion";
import { once } from "events";
import { useRouter } from "next/navigation";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Multiplayer Drawing",
      description: "Collaborate seamlessly with your entire team.",
      badge: "Real-time",
      gradient: "from-green-400 to-blue-500",
    },
    {
      icon: Infinity,
      title: "Infinite Canvas",
      description: "Never run out of space.",
      badge: "Unlimited",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: Zap,
      title: "Lightning Sync",
      description: "Changes appear instantly across all devices.",
      badge: "Instant",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Palette,
      title: "Creative Tools",
      description: "Everything you need to create.",
      badge: "Pro Tools",
      gradient: "from-pink-400 to-red-500",
    },
  ];
  const router = useRouter();

  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 bg-primary-light/20 border-primary/30 text-primary"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-wide">
              Everything you need to
              <span className="text-gradient block">collaborate visually</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade tools designed for modern teams. From
              brainstorming to project planning, Think-Board adapts to your
              workflow.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                key={index}
              >
                <Card className="card bg-white/50 backdrop-blur-sm group shadow-none h-full hover:shadow-sm hover:scale-105 duration-400 hover:border-1 hover:border-secondary">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-soft`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center bg-card-gradient rounded-3xl p-12 shadow-card">
            <div className="flex items-center justify-center mb-4">
              <Cloud className="w-8 h-8 text-primary mr-3" />
              <Badge
                variant="outline"
                className="bg-primary-light/20 border-primary/30 text-primary"
              >
                No Installation Required
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to transform your team's collaboration?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using Think-Board to bring their
              best ideas to life.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => {
                    router.push("/room/create");
                  }}
                >
                  Start Your Free Board
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
