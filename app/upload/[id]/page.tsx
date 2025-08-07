import UploadContent from './UploadContent';

interface UploadPageProps {
  params: {
    id: string;
  };
}

export default function UploadPage({ params }: UploadPageProps) {
  return <UploadContent submissionId={params.id} />;
}