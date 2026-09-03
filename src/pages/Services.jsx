import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { getServices } from "../services/servicesService";
import { getPackages } from "../services/packagesService";
import Loader from "../components/Loader";
import useSEO from "../hooks/useSEO";
import { Check, Info } from "lucide-react";

export default function Services() {
  useSEO({
    title: "Services & Pricing Packages | Creative Studio",
    description: "Explore our range of creative services in Tirunelveli alongside package prices: Personal Reels, Car/Bike deliveries, and Events.",
    keywords: "Personal reels Tirunelveli, Car delivery reels Tirunelveli, event coverage packages, Reels prices Tirunelveli"
  });

  const [services, setServices] = useState(null);
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    Promise.all([getServices(), getPackages()])
      .then(([srvs, pkgs]) => {
        setServices(srvs);
        setPackages(pkgs);
      })
      .catch((err) => {
        console.error("Failed to load combined services page data", err);
        setServices([]);
        setPackages([]);
      });
  }, []);

  if (!services || !packages) return <Loader label="Loading services and package plans" />;

  return (
    <>
      <PageHeader
        eyebrow="OUR SERVICES &amp; PRICING"
        title="Cinematic production services with transparent pricing packages."
        description="Choose from our standard package options below or reach out for custom production plans in Tirunelveli."
      />

      <section className="bg-paper py-12 pb-24 font-sans">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-28">
          {services.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate/15">
              <p className="text-slate-soft">No services available at the moment.</p>
            </div>
          ) : (
            services.map((service, index) => {
              // Find packages belonging to this specific service category
              const relatedPackages = packages.filter(
                (pkg) =>
                  pkg.category.toLowerCase().includes(service.title.toLowerCase()) ||
                  service.title.toLowerCase().includes(pkg.category.toLowerCase())
              );

              return (
                <div
                  key={service.id}
                  className="flex flex-col gap-10 pb-24 border-b border-slate/10 last:border-b-0"
                >
                  {/* Service Details Alternating Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Media */}
                    <div className={`lg:col-span-5 relative overflow-hidden aspect-video lg:aspect-[4/3] bg-slate ${index % 2 !== 0 ? "lg:order-last" : ""}`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-ink/10" />
                    </div>

                    {/* Text */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <span className="eyebrow text-studio-blue font-bold tracking-widest mb-3">
                        SERVICE 0{index + 1}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl text-ink font-bold leading-tight mb-4">
                        {service.title}
                      </h2>
                      <p className="text-slate-soft text-sm md:text-base leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Checklist */}
                      <div className="mb-6">
                        <p className="eyebrow text-slate-soft text-[10px] mb-3 font-bold">Standard Features Included:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                          {service.features && service.features.map((feature, i) => (
                            <li key={i} className="text-xs text-slate-soft flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 w-4 h-4 bg-studio-blue text-signal-gold flex items-center justify-center">
                                <Check size={10} className="stroke-[3]" />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Cards for this specific service */}
                  {relatedPackages.length > 0 && (
                    <div className="mt-4">
                      <p className="eyebrow text-studio-blue text-[10px] font-bold mb-6 tracking-widest text-center lg:text-left">
                        AVAILABLE PACKAGES FOR {service.title.toUpperCase()}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-white border border-slate/10 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                          >
                            <div>
                              <h4 className="font-display text-lg font-bold text-ink mb-1">{pkg.packageName} Deal</h4>
                              <p className="font-sans text-2xl font-extrabold text-studio-blue-deep mt-2 mb-4">
                                ₹{pkg.price.toLocaleString("en-IN")}
                              </p>
                              <ul className="flex flex-col gap-2 mb-6">
                                {pkg.features.map((feat, i) => (
                                  <li key={i} className="text-xs text-slate-soft flex items-start gap-2">
                                    <Check size={11} className="text-green-600 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t border-slate/5">
                              <Link
                                to={`/booking?service=${encodeURIComponent(pkg.category)}&package=${encodeURIComponent(pkg.packageName)}`}
                                className="eyebrow block text-center bg-ink text-paper py-2.5 hover:bg-studio-blue transition-colors font-bold text-[10px] tracking-wider"
                              >
                                Choose Package
                              </Link>
                              <WhatsAppButton
                                packageName={pkg.packageName}
                                serviceName={pkg.category}
                                variant="outline"
                                label="WhatsApp Enquiry"
                                className="text-[10px] py-2.5 font-bold tracking-wider"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Custom Info Note */}
          <div className="bg-mist/30 border border-slate/10 p-6 max-w-3xl mx-auto flex gap-4 items-start">
            <Info size={20} className="text-studio-blue shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-ink mb-1">Looking for a customized campaign or event package?</p>
              <p className="text-slate-soft text-xs leading-relaxed">
                If our predefined packages do not match your shoot size or budget guidelines, get in touch directly. We regularly prepare custom quotes for showrooms, local businesses, and multi-day weddings in Tirunelveli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <WhatsAppButton variant="sticky" />
    </>
  );
}
