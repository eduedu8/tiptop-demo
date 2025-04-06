"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Script from "next/script";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState("");
  // Store the selected location from autocomplete.
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  // When the user clicks "Analyze Property," we simulate a detailed analysis.
  const [propertyData, setPropertyData] = useState<null | {
    type: string;
    features: {
      // Immediate opportunities:
      bandwidth: boolean;
      rooftop: boolean;
      parking: boolean;
      garden: boolean;
      // More opportunities:
      pool: boolean;
      storage: boolean;
      car: boolean;
      item: boolean;
    };
  }>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<{ [key: string]: boolean }>({});
  const [showQuestions, setShowQuestions] = useState(false);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  // These are your simulated estimates.
  const simulatedEstimates: { [key: string]: { income: string; details: string } } = {
    bandwidth: { income: "$120/mo", details: "25.00 Mbps, FastNet, 35ms, IP: 192.168.1.2" },
    rooftop: { income: "$100/mo", details: "Solar panel potential available" },
    parking: { income: "$80/mo", details: "2 parking spaces detected, 1 with EV charging" },
    garden: { income: "$50/mo", details: "Spacious garden with high yield potential" },
    pool: { income: "Contact Partner", details: "160 sqft pool detected, restroom available" },
    storage: { income: "Contact Partner", details: "220 sqft warehouse detected" },
    car: { income: "Contact Partner", details: "Car monetization details unavailable" },
    item: { income: "Contact Partner", details: "Item monetization details unavailable" },
  };

  // Refs for the autocomplete input and map container.
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps Autocomplete.
  useEffect(() => {
    if (mapsLoaded && window.google && autocompleteInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ["address"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
        if (place.geometry && place.geometry.location) {
          setSelectedLocation(place.geometry.location);
        }
      });
    }
  }, [mapsLoaded]);

  // Once a location is selected and before analysis, show the map from far (zoom level 12).
  useEffect(() => {
    if (selectedLocation && mapRef.current && !propertyData) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: selectedLocation,
        zoom: 12,
        mapTypeId: "satellite",
      });
      new window.google.maps.Marker({
        position: selectedLocation,
        map: map,
      });
    }
  }, [selectedLocation, propertyData]);

  // When the user clicks "Analyze Property," simulate a detailed analysis and zoom in the map.
  const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPropertyData({
      type: "House",
      features: {
        bandwidth: true,
        rooftop: true,
        parking: true,
        garden: true,
        pool: true,
        storage: true,
        car: false,
        item: false,
      },
    });
    if (mapRef.current && selectedLocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: selectedLocation,
        zoom: 18,
        mapTypeId: "satellite",
      });
      new window.google.maps.Marker({
        position: selectedLocation,
        map: map,
      });
    }
  };

  // Simulated bandwidth test.
  const testBandwidth = async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "25.00 Mbps, FastNet, 35ms, IP: 192.168.1.2";
  };

  // When "Bandwidth" is selected, run the simulated test.
  useEffect(() => {
    const runBandwidthTest = async () => {
      if (selectedOpportunities["bandwidth"] && (!responses["bandwidth"] || responses["bandwidth"] === "")) {
        const result = await testBandwidth();
        setResponses((prev) => ({ ...prev, bandwidth: result }));
      }
    };
    runBandwidthTest();
  }, [selectedOpportunities]);

  // Toggle checkbox selection.
  const handleCheckboxChange = (opportunity: string) => {
    setSelectedOpportunities((prev) => ({
      ...prev,
      [opportunity]: !prev[opportunity],
    }));
  };

  // Define immediate and more opportunities.
  const immediateOpportunities = ["bandwidth", "rooftop", "parking", "garden"];
  const moreOpportunities = ["pool", "storage", "car", "item"];

  // Display names for opportunities.
  const opportunityDisplayNames: { [key: string]: string } = {
    bandwidth: "Bandwidth",
    rooftop: "Rooftop",
    parking: "Parking",
    garden: "Garden",
    pool: "Pool",
    storage: "Storage",
    car: "Car",
    item: "Item",
  };

  // Prompts for additional information.
  const opportunityQuestions: { [key: string]: string } = {
    bandwidth: "We have automatically run an internet test. If needed, please verify or update these details.",
    rooftop: "Please upload your utility bill or provide your energy usage details.",
    parking: "Describe your parking spaces (dimensions, location, EV charging info).",
    garden: "Provide details of your garden size, features, and potential yield.",
    pool: "Describe the pool (size, condition, additional features like an outside restroom).",
    storage: "Detail your available storage space.",
    car: "Provide details about your car (make, model, year).",
    item: "List the items you want to monetize with a description and condition.",
  };

  // When the additional information form is submitted, redirect to sign in if not signed in,
  // then to the dashboard.
  const handleQuestionsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Additional Information Submitted:", responses);
    // Here, send the collected data to your back end if needed.

    if (!session) {
      // If the user is not signed in, redirect them to sign in with a callback URL.
      signIn("google", { callbackUrl: "/dashboard" });
    } else {
      // If signed in, navigate directly to the dashboard.
      router.push("/dashboard");
    }
  };

  // Mark maps as loaded when the Google Maps script finishes loading.
  const handleScriptLoad = () => {
    setMapsLoaded(true);
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#FFFDED", color: "#552B1B", fontFamily: '"Work Sans", sans-serif' }}
    >
      <Head>
        <title>Kolonia - Monetize Your Assets</title>
        <meta name="description" content="Monetize your assets and property with Kolonia" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@700&family=Work+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Load Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
  <div style={{ fontFamily: '"Fahkwang", sans-serif' }}>
    <span style={{ fontSize: '2rem', color: '#552B1B' }}>tiptop</span>
    <span style={{ fontSize: '1rem', color: '#AA94E2' }}> by kolonia</span>
  </div>
  <div>
    {session ? (
      <button onClick={() => signIn("google")} className="bg-[#AA94E2] text-white py-2 px-4 rounded">
        Account
      </button>
    ) : (
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="bg-[#AA94E2] text-white py-2 px-4 rounded">
        Sign In
      </button>
    )}
  </div>
</header>

      {/* Main Content */}
      <main>
        {/* Address Input & Analysis Form */}
        <section className="mb-8">
          <h2 className="text-3xl mb-4" style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}>
            Discover Your Property's Earning Potential
          </h2>
          <form onSubmit={handleAddressSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <input
              ref={autocompleteInputRef}
              type="text"
              placeholder="Enter your address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-3 border border-gray-300 rounded flex-1"
              style={{ fontSize: "1rem", color: "#552B1B" }}
            />
            <button
              type="submit"
              className="bg-[#AA94E2] text-white py-2 px-4 rounded text-xl"
              style={{ fontFamily: '"Fahkwang", sans-serif' }}
            >
              Analyze Property
            </button>
          </form>
        </section>

        {/* Google Map */}
        <section className="mb-8">
          <div
            ref={mapRef}
            className="w-full h-96 border border-gray-300 rounded flex items-center justify-center"
          >
            {!mapsLoaded && <p>Loading map...</p>}
          </div>
        </section>

        {/* Monetization Opportunities */}
        {propertyData && (
          <section className="mb-8">
            <h2 className="text-4xl mb-4" style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}>
              Monetization Opportunities
            </h2>

            {/* Immediate Opportunities */}
            <div className="mb-6">
              <h3 className="text-2xl mb-2" style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}>
                Immediate Opportunities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {immediateOpportunities.map((opp) => (
                  <label key={opp} className="flex items-center p-3 border rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedOpportunities[opp] || false}
                      onChange={() => handleCheckboxChange(opp)}
                    />
                    <span className="flex-1">{opportunityDisplayNames[opp]}</span>
                    <div className="text-right">
                      <div className="font-bold">{simulatedEstimates[opp]?.income}</div>
                      <hr className="my-1 border-t border-gray-300" />
                      <div className="text-xs">{simulatedEstimates[opp]?.details}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* More Opportunities */}
            <div className="mb-6">
              <h3 className="text-2xl mb-2" style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}>
                More Opportunities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {moreOpportunities.map((opp) => (
                  <label key={opp} className="flex items-center p-3 border rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedOpportunities[opp] || false}
                      onChange={() => handleCheckboxChange(opp)}
                    />
                    <span className="flex-1">{opportunityDisplayNames[opp]}</span>
                    <div className="text-right">
                      <div className="font-bold">{simulatedEstimates[opp]?.income}</div>
                      <hr className="my-1 border-t border-gray-300" />
                      <div className="text-xs">{simulatedEstimates[opp]?.details}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowQuestions(true)}
                className="bg-[#AA94E2] text-white py-2 px-4 rounded text-xl"
                style={{ fontFamily: '"Fahkwang", sans-serif' }}
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* Additional Information Section */}
        {showQuestions && (
          <section className="mb-8">
            <h2 className="text-4xl mb-4" style={{ fontFamily: '"Fahkwang", sans-serif', color: "#AA94E2" }}>
              Additional Information Required
            </h2>
            <form onSubmit={handleQuestionsSubmit} className="flex flex-col gap-4">
              {Object.keys(selectedOpportunities)
                .filter((opp) => selectedOpportunities[opp])
                .map((opp) => (
                  <div key={opp} className="flex flex-col">
                    <label className="mb-1" style={{ fontFamily: '"Fahkwang", sans-serif' }}>
                      {opportunityDisplayNames[opp]}:
                    </label>
                    <p className="text-xs text-gray-600 mb-1">
                      {simulatedEstimates[opp]?.details}
                    </p>
                    <textarea
                      placeholder={opportunityQuestions[opp]}
                      value={responses[opp] || ""}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, [opp]: e.target.value }))
                      }
                      className="p-3 border border-gray-300 rounded"
                      rows={3}
                    />
                  </div>
                ))}
              <button
                type="submit"
                className="bg-[#AA94E2] text-white py-2 px-4 rounded text-xl"
                style={{ fontFamily: '"Fahkwang", sans-serif' }}
              >
                Submit Information
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
