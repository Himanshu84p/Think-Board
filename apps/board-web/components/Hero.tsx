import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center overflow-hidden dark:bg-background bg-background pt-16 "
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-64 h-64 bg-primary-light/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.6,
                }}
              >
                <Badge
                  variant="outline"
                  className="bg-white/20 border-primary/30 text-primary font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Real-time Collaboration
                </Badge>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.6,
                }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  Create
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6,
                    }}
                  >
                    <span className="text-gradient block">Together</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6,
                    }}
                  >
                    <span className="text-primary">in Real-time</span>
                  </motion.div>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  Draw, brainstorm, and build together with infinite
                  possibilities.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={"/room/create"}>
                  <Button
                    variant="hero"
                    size="lg"
                    className="text-lg px-8 py-4"
                  >
                    Start Collaborating
                    <Play className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            {/* 
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Free for Teams
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                No Downloads
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Works Everywhere
              </div>
            </div> */}
          </div>

          {/* Right Column - Visual Demo */}
          <div className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-cta-gradient rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-background/60 backdrop-blur-sm rounded-3xl p-4 shadow-card animate-float card shadow-2xl">
                <img
                  src="/hero_board.png"
                  alt="Think-Board collaborative whiteboard interface showing real-time collaboration with multiple users, sticky notes, and drawing tools"
                  className="w-full h-auto rounded-2xl shadow-soft"
                />

                {/* Floating collaboration indicators */}
                <div className="absolute -top-2 -left-2 bg-foreground rounded-full p-3 shadow-md animate-float">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div
                  className="absolute -top-2 -right-2 bg-foreground rounded-full p-3 shadow-md animate-float"
                  style={{ animationDelay: "-1s" }}
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div
                  className="absolute -bottom-2 -left-2 bg-foreground rounded-full p-3 shadow-md animate-float"
                  style={{ animationDelay: "-2s" }}
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
