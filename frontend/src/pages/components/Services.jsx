import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="bg-gray-50 w-full">
      <div className="py-8 md:py-30 flex flex-col justify-center place-content-center px-4">
        <h1 className="text-[#1694a4] font-bold text-2xl md:text-3xl flex justify-center my-6 md:my-8">
          Services We Provide
        </h1>
        <p className="max-w-xl mx-auto md:ml-[35%] mb-12 md:mb-20 text-sm md:text-base text-center md:text-left">
          At MediConnect, we offer a wide range of professional medical services tailored to your needs. From general checkups and dental care to advanced diagnostic tests and expert consultations, we ensure quality healthcare at every step. Our experienced team of doctors and specialists is committed to delivering compassionate and personalized care. Whether you're booking an appointment or following up on a prescription, we're here to support your health journey. Experience convenience, trust, and excellence—under one roof.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-4 md:mx-30">
          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="my-4 md:my-5 rounded-xl w-full max-w-xs md:max-w-none"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBWW-6OV3U2JhLUQM9CD5b973TFI3-931yw&s"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              Chemotherapy
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Chemotherapy is a treatment that uses powerful drugs to destroy
              cancer cells. It works by targeting cells that divide rapidly,
              which includes cancer cells. It's usually given in cycles and can
              be administered orally or intravenously. Side effects may include
              fatigue, hair loss, and nausea. It's a common treatment for many
              types of cancer.
            </p>
            <Link to={"https://www.mayoclinic.org/tests-procedures/chemotherapy/about/pac-20385033"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
             </Link>
          </div>

          {/*2nd column* */}
          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="my-4 md:my-5 rounded-xl w-full max-w-xs md:max-w-none"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhsaGcdlyBJJzCjtwUAmiVgimYl9GavTklCA&s"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              Dialysis
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Dialysis is a procedure that removes waste, toxins, and excess
              fluids from the blood. It is used when the kidneys fail to perform
              their filtering function properly. There are two main types:
              hemodialysis and peritoneal dialysis. Patients may need it
              multiple times per week. It helps manage symptoms of kidney
              failure but isn't a cure.
            </p>
            <Link to={"https://www.kidney.org/kidney-topics/dialysis"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
             </Link>
          </div>
          {/*3rd column* */}

          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="my-4 md:my-5 rounded-xl w-full max-w-xs md:max-w-none"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRes0Mc6IT0g0bj7skOJ9w9llw--cOZtdMWSw&s"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              {" "}
              Physiotherapy
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Physiotherapy helps restore movement and function when someone is
              affected by injury, illness, or disability. It involves exercises,
              manual therapy, education, and advice. Commonly used after
              surgeries, strokes, or sports injuries. It improves strength,
              flexibility, and balance. Therapy plans are tailored to each
              patient's needs.
            </p>
            <Link to={"https://my.clevelandclinic.org/health/treatments/21054-physical-therapy"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
           </Link>
          </div>

          {/*4th column* */}

          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="my-4 md:my-5 rounded-xl w-full max-w-xs md:max-w-none"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF8Dwz9HE0Xq3uNRpJajARZ9SpDxcQMsQ-Tg&s"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              Vaccination
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Vaccines train the immune system to recognize and fight specific
              infections. They are made using weakened or inactivated viruses or
              parts of pathogens. Vaccination is key to preventing diseases like
              measles, polio, and COVID-19. They are safe and undergo extensive
              testing. Mass vaccination helps in achieving herd immunity.
            </p>
            <Link to={"https://www.who.int/health-topics/vaccines-and-immunization#tab=tab_1"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
             </Link>
          </div>
          {/*5th column* */}

          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="w-full max-w-xs md:w-[350px] my-4 md:my-5 rounded-xl"
                src="https://i0.wp.com/asianheartinstitute.org/wp-content/uploads/2024/09/The-Essential-Guide-to-General-Surgery-What-You-Need-To-Know.jpg?fit=1572%2C917&ssl=1"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              Surgery
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Surgery involves cutting into the body to treat diseases,
              injuries, or deformities. It can be elective, emergency, or for
              diagnostic purposes. Techniques range from open surgery to
              minimally invasive procedures. Anesthesia is used to prevent pain
              during the operation. Recovery time depends on the type and
              complexity of the surgery.
            </p>
            <Link to={"https://medlineplus.gov/surgery.html"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
            </Link>
          </div>
          {/*6th column* */}

          <div className="bg-white rounded-3xl">
            <div className="flex justify-center">
              <img
                className="my-4 md:my-5 rounded-xl w-full max-w-xs md:max-w-none"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWujLaVRyh5zmYrhH0wngIPDlnUnGgU9SRkQ&s"
                alt=""
              />
            </div>
            <h3 className="px-4 md:px-5 text-lg md:text-xl my-3 md:my-4 text-[#1694a4] font-medium">
              Dental Treatment
            </h3>
            <p className="px-4 md:px-5 text-gray-600 py-2 md:py-3 text-sm md:text-base">
              Dental treatment involves the prevention, diagnosis, and
              management of oral health issues such as cavities, gum disease,
              and tooth loss. Common procedures include cleanings, fillings,
              root canals, crowns, and extractions. Dentists also offer cosmetic
              services like teeth whitening and orthodontics to improve the
              appearance of teeth. 
            </p>
            <Link to={"https://www.sciencedirect.com/topics/medicine-and-dentistry/dental-treatment"} className="px-4 md:px-5 text-[#1694a4] py-6 md:py-10 block" >
              Learn More &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
