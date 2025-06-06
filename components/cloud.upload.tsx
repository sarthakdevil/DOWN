'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function UploadPaymentScreenshot({ onUpload }: { onUpload: (url: string) => void }) {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: 'mulakatjunction/screenshots',
        }}
        onSuccess={(result: any) => {
          const url = result.info.secure_url;
          setImageUrl(url);
          onUpload(url); // pass the URL to parent for DB use
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="bg-blue-600 px-4 py-2 text-white rounded-md"
          >
            Upload Payment Screenshot
          </button>
        )}
      </CldUploadWidget>

      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Screenshot:</p>
          <img src={imageUrl} alt="Uploaded Screenshot" className="w-48 mt-2 rounded" />
        </div>
      )}
    </div>
  );
}
