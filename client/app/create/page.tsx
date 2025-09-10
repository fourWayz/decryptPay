"use client";
import { useState } from "react";
import UploadStep from "@/app/components/create/UploadStep";
import EncryptStep from "@/app/components/create/EncryptStep";
import PriceStep from "@/app/components/create/PriceStep";
import ConfirmStep from "@/app/components/create/ConfirmStep";
import Navbar from "../components/Navbar";

export default function CreatePage() {
  const [step, setStep] = useState(1);

  // 🔹 Shared state across all steps
  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<Uint8Array | null>(null);
  const [encKey, setEncKey] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
        {/* Stepper */}
        <div className="flex space-x-8 mb-10">
          {["Upload File", "Encryption", "Set Price & Details", "Confirm & Sign"].map(
            (label, index) => {
              const current = index + 1;
              const isActive = step === current;
              const isCompleted = step > current;

              return (
                <div key={label} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${isActive ? "bg-blue-500" : isCompleted ? "bg-green-500" : "bg-gray-700"}`}
                  >
                    {current}
                  </div>
                  <span className={`${isActive ? "font-semibold text-white" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* Steps */}
        <div className="w-full max-w-xl">
          {step === 1 && (
            <UploadStep
              file={file}
              setFile={setFile}
              onNext={next}
            />
          )}
          {step === 2 && (
            <EncryptStep
              file={file}
              encryptedFile={encryptedFile}
              setEncryptedFile={setEncryptedFile}
              setEncKey={setEncKey}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 3 && (
            <PriceStep
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 4 && (
            <ConfirmStep
              file={file}
              encryptedFile={encryptedFile}
              encKey={encKey}
              title={title}
              description={description}
              price={price}
              onPrev={prev}
            />
          )}
        </div>
      </div>
    </>
  );
}
