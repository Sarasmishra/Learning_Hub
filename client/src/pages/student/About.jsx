import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Coffee, Star } from "lucide-react";

/**
 * AboutPage (Fun Project Edition)
 * - Playful tone and copy
 * - Drop-in ready for shadcn/tailwind projects
 * - Edit names/images/stats below as you like
 */

const AboutPage = () => {
  const project = {
    name: "Learning Hub (Fun Build)",
    tagline: "A playful LMS experiment — learn, tinker, repeat.",
    blurb:
      "This is a lighthearted project made for learning, prototyping UI, and shipping small features fast. No corporate buzzwords here — only coffee, curiosity, and messy commits.",
    contact: "hello@learninghub.fun",
    location: "Made with ❤️ in a cozy corner",
  };

  const stats = [
    { label: "Late-night commits", value: "∞" },
    { label: "Coffees consumed", value: "many ☕" },
    { label: "Courses imagined", value: "42 (maybe)" },
    { label: "Bugs squashed", value: "too few" },
  ];

  const team = [
    { name: "Saras", role: "Chief Tinkerer", image: null },
    { name: "Code Cat", role: "Senior Bug Inspector", image: null },
    { name: "Beta Tester", role: "Professional Clicker", image: null },
  ];

  const faqs = [
    {
      q: "Is this production-ready?",
      a: "Depends — if your production runs on curiosity and snacks, maybe. Otherwise: use with love (and tests).",
    },
    {
      q: "Can I contribute?",
      a: "Yes! Create PRs, ship tiny improvements, and add silly animations — we love that.",
    },
  ];

  return (
    <main className="pt-20 bg-gradient-to-b from-slate-50 to-white dark:from-[#050505] dark:to-[#0b0b0b] min-h-screen">
      {/* Hero */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center gap-3 bg-white/90 dark:bg-slate-900/60 rounded-full px-4 py-2 shadow-md mb-6">
            <Star className="text-amber-400" />
            <span className="text-sm font-medium">Fun project • no corporate overlords</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">
            About {project.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {project.tagline}
          </p>

          <p className="mt-6 text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            {project.blurb}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/courses">
              <Button>Browse playful courses</Button>
            </Link>
            <a href={`mailto:${project.contact}`}>
              <Button variant="ghost">Say hi</Button>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Story / Left */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardContent>
                <h2 className="text-2xl font-bold">Why we built this</h2>
                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  Because building stuff is the best way to learn. This project is a playground where we try UI ideas, practice React patterns,
                  and pretend we know how to write perfect CSS. Spoiler: we don't — and that's okay.
                </p>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  If you spot anything funny (or broken), open an issue or a PR —extra points for puns.
                </p>
              </CardContent>
            </Card>

            {/* Team */}
            <section>
              <h3 className="text-xl font-semibold mb-3">The small-but-mighty team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {team.map((m, i) => (
                  <div key={i} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Avatar>
                      {m.image ? (
                        <AvatarImage src={m.image} alt={m.name} />
                      ) : (
                        <AvatarFallback>{m.name.split(" ").map(n => n[0]).slice(0,2).join("")}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-slate-500">{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Quick FAQs</h3>
              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <details key={idx} className="p-3 border rounded-lg">
                    <summary className="font-medium cursor-pointer">{f.q}</summary>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Stats + Contact */}
          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold">Fun stats</h4>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="p-3 bg-transparent rounded-md">
                      <div className="text-xs text-slate-500">{s.label}</div>
                      <div className="text-lg font-semibold">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold">Contact</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.location}</p>

                <div className="mt-3 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <a className="text-slate-700 dark:text-slate-200" href={`mailto:${project.contact}`}>{project.contact}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee size={14} />
                    <span className="text-slate-500 dark:text-slate-400">Coffee-friendly support</span>
                  </div>
                </div>

                <div className="mt-4">
                  <a href={`mailto:${project.contact}`}>
                    <Button className="w-full">Drop a hello</Button>
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center">
                Built for fun • fork and remix freely
              </div>
            </div>
          </aside>
        </div>

        <Separator className="my-10" />

        <footer className="py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Learning Hub — made for learning & laughs.
        </footer>
      </div>
    </main>
  );
};

export default AboutPage;
