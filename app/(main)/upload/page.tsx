import Upload from "@/app/components/upload/Upload";

const UploadPage = () => {
  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-2">
        Let&apos;s analyze your resume
      </h1>
      <p className="text-sm max-w-xl mb-8">
        Add your resume and the job you&apos;re targeting. Everything stays
        private: files are processed in your session and never stored.
      </p>
      <Upload />
    </div>
  );
};

export default UploadPage;
