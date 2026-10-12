import { useState } from "react";

import { Button, FrontendQuestionSettingsAreaComponent } from "@examplary/ui";
import { Loader2Icon, UploadIcon } from "lucide-react";

import { Area, PointImage } from "./shared";

const SettingsAreaComponent: FrontendQuestionSettingsAreaComponent = ({
  settings,
  setSetting,
  setMultipleSettings,
  api,
  t,
}) => {
  const [uploading, setUploading] = useState(false);
  const areas = (settings.areas as Area[]) || [];

  const uploadImage = async () => {
    setUploading(true);
    try {
      const { url } = await api.uploadFile("image/*");
      setMultipleSettings({
        image: url,
        width: undefined,
        height: undefined,
        areas: [],
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold font-heading">{t("image")}</label>
      {settings.image && (
        <>
          <div className="text-sm text-zinc-500">{t("help")}</div>
          <PointImage
            settings={settings}
            areas={areas}
            onClick={({ x, y }, width) =>
              setSetting("areas", [
                ...areas,
                { shape: "circle", coords: [x, y, Math.round(width / 30)] },
              ])
            }
            onAreaClick={(index) =>
              setSetting(
                "areas",
                areas.filter((_, i) => i !== index),
              )
            }
          />
        </>
      )}
      <div>
        <Button variant="secondary" onClick={uploadImage} disabled={uploading}>
          {uploading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <UploadIcon />
          )}
          {t(settings.image ? "change-image" : "upload-image")}
        </Button>
      </div>
    </div>
  );
};

export default SettingsAreaComponent;
