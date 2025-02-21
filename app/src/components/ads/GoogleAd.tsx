import React, { useEffect } from "react";

interface AdComponentProps {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
}

const AdComponent: React.FC<AdComponentProps> = ({
  adSlot,
  adFormat = "auto",
  adLayout = "",
}) => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("Error loading ads:", e);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-9619673959926931"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
