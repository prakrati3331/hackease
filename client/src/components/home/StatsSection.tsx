export default function StatsSection() {
  const stats = [
    { value: "500+", label: "Hackathons Hosted" },
    { value: "10,000+", label: "Participants" },
    { value: "2,500+", label: "Projects Completed" },
    { value: "92%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
