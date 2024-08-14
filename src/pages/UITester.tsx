import SnipppButton from "../components/SnipppButton";
import { useNotif } from "../hooks/Notif";

const UITester = () => {
  const { showNotif } = useNotif();
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-8 p-10 text-black dark:text-white">
      <h1>UI Tester</h1>
      Buttons with text
      <div className="flex h-full gap-4">
        <SnipppButton
          onClick={() => console.log("Button Clicked")}
          colorType="add"
        >
          Add
        </SnipppButton>
        <SnipppButton
          onClick={() => console.log("Button Clicked")}
          colorType="delete"
        >
          Delete
        </SnipppButton>
        <SnipppButton
          onClick={() => console.log("Button Clicked")}
          colorType="neutral"
        >
          Neutral
        </SnipppButton>
      </div>
      Notification activations with no timeout
      <div className="flex h-full gap-4">
        <SnipppButton
          onClick={() => showNotif("This is a success notification", "success")}
          colorType="add"
        >
          Display Success Notif
        </SnipppButton>
        <SnipppButton
          onClick={() => showNotif("This is an error notification", "error")}
          colorType="delete"
        >
          Display Error Notif
        </SnipppButton>
        <SnipppButton
          onClick={() => showNotif("This is an info notification", "info")}
          colorType="neutral"
        >
          Display Info Notif
        </SnipppButton>
      </div>
      Notification activations with 5s timeout
      <div className="flex h-full gap-4">
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is a success notification with countdown",
              "success",
              5000,
            )
          }
          colorType="add"
        >
          Display Success Notif
        </SnipppButton>
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is an error notification with countdown",
              "error",
              5000,
            )
          }
          colorType="delete"
        >
          Display Error Notif
        </SnipppButton>
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is an info notification with countdown",
              "info",
              5000,
            )
          }
          colorType="neutral"
        >
          Display Info Notif
        </SnipppButton>
      </div>
      Notification activations with 5s timeout but no countdown display
      <div className="flex h-full gap-4">
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is a success notification with countdown but no display",
              "success",
              5000,
              false,
            )
          }
          colorType="add"
        >
          Display Success Notif
        </SnipppButton>
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is an error notification with countdown but no display",
              "error",
              5000,
              false,
            )
          }
          colorType="delete"
        >
          Display Error Notif
        </SnipppButton>
        <SnipppButton
          onClick={() =>
            showNotif(
              "This is an info notification with countdown but no display",
              "info",
              5000,
              false,
            )
          }
          colorType="neutral"
        >
          Display Info Notif
        </SnipppButton>
      </div>
    </div>
  );
};

export default UITester;
