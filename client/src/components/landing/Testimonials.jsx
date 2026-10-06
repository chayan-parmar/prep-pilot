import TestimonialCard from "./TestimonialCard";

function Testimonials() {

  const reviews = [

    {
      name: "Rahul Sharma",
      role: "Software Engineer @ TCS",
      review:
        "This platform completely changed my interview preparation. The AI mock interviews felt very realistic.",
    },

    {
      name: "Priya Patel",
      role: "Frontend Developer @ Infosys",
      review:
        "The Resume Analyzer helped me improve my ATS score from 62 to 91.",
    },

    {
      name: "Aman Verma",
      role: "SDE @ Amazon",
      review:
        "The coding practice and analytics dashboard kept me motivated every day.",
    },

  ];

  return (

    <section className="bg-[var(--card)] px-6 py-16 lg:px-16 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Testimonials
          </p>
          <h2 className="font-[var(--font-headings)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Loved by Engineers & Job Seekers
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <TestimonialCard
              key={review.name}
              {...review}
            />
          ))}
        </div>
      </div>
    </section>

  );
}

export default Testimonials;