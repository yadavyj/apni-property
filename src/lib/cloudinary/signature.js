import cloudinary from "@/lib/cloudinary/config";

export function signUploadParams(paramsToSign) {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );
}
