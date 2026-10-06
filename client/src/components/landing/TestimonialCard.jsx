import { Star } from "lucide-react";

function TestimonialCard({
  name,
  role,
  review,
}) {
  return (
    <div className="bg-[#141B2D] border border-gray-800 rounded-3xl p-8 hover:border-violet-500 transition">

      <div className="flex mb-5">

        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}

      </div>

      <p className="text-gray-300 leading-7">

        "{review}"

      </p>

      <div className="mt-8">

        <h3 className="text-white font-bold">

          {name}

        </h3>

        <p className="text-gray-400 text-sm">

          {role}

        </p>

      </div>

    </div>
  );
}

export default TestimonialCard;