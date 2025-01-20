import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import policyData from "../data/policyContent.json";
import { FaArrowRight } from "react-icons/fa";
import Footer from "../components/common/Footer";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4  sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Policy Header */}
          <div className="bg-green-700 text-center px-5 py-5 sm:px-8 sm:py-6">
            <h2 className="text-[15px] sm:text-lg md:text-2xl font-nunito-sans font-extrabold text-white">
              East African Community Internship Policy
            </h2>
            <p className="mt-2 text-[13px] md:text-base text-primary-100">
              Please review our internship policy before proceeding with your
              application
            </p>
          </div>

          {/* Policy Content */}
          <div className="px-6 py-8 sm:px-20">
            <div className="space-y-6">
              {policyData.content.map((item, index) => (
                <div key={index} className="space-y-4">
                  {item.section && (
                    <h3 className="text-sm sm:text-base font-bold font-nunito-sans text-gray-600">
                      {item.section}
                    </h3>
                  )}
                  <div className="space-y-3">
                    {item.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-600 text-[13px] sm:text-sm md:text-base font-nunito-sans leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => navigate("/applications")}
                className="inline-flex items-center space-x-3 px-6 py-3 text-[13px] sm:text-sm md:text-base border border-transparent  font-semibold rounded-lg shadow-md text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors duration-200"
              >
                <span>Continue to Application</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
