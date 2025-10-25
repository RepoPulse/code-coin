import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GitHubAppCallback() {
  const router = useRouter();
  const { installation_id } = router.query;

  useEffect(() => {
    if (installation_id) {
      console.log("GitHub App Installation ID:", installation_id);
      // You can now store it in your DB or exchange it for a token
    }
  }, [installation_id]);

  return (
    <div>
      GitHub App installation successful! Installation ID: {installation_id}
    </div>
  );
}
