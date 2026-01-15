import { ArrowUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-8 section-padding border-t border-border/30">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} Joshua Vaz. All rights reserved.
          </p>

          {/* Actions */}
          <div className="order-1 md:order-2 flex items-center gap-4">
            {/* Admin CMS Button */}
            <Link
              to="/admin/login"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border/50 rounded-full font-body text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Lock className="w-3 h-3" />
              Admin CMS
            </Link>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to top
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
