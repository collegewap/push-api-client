import {
  Card,
  Button,
  FormGroup,
  InputGroup,
  H2,
  TextArea,
  Intent,
  HTMLSelect,
  Toaster,
  Position,
} from "@blueprintjs/core";
import React, { useEffect, useRef, useState } from "react";
const allOption = [{ value: "all", label: "All" }];

const API_ENDPOINT = "https://react-native-push-api.herokuapp.com/";

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [data, setData] = useState();
  const [recipients, setRecipients] = useState(allOption);
  const [to, setTo] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    fetch(API_ENDPOINT + "all_tokens").then(async (response) => {
      if (response.ok) {
        const tokens = await response.json();
        setRecipients(allOption.concat(tokens));
      }
    });
  }, []);

  const formSubmitHandler = (e) => {
    let parsedData = {};
    try {
      parsedData = data ? JSON.parse(data) : {};
    } catch (err) {
      console.log(err);
    }

    e.preventDefault();

    setIsSubmitting(true);
    fetch(API_ENDPOINT + "send_notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        title,
        body,
        data: parsedData,
      }),
    })
      .then(async (response) => {
        setIsSubmitting(false);

        if (response.ok) {
          toastRef.current.show({
            icon: "tick",
            intent: Intent.SUCCESS,
            message: "Notification sent successfully.",
          });
        } else {
          toastRef.current.show({
            icon: "warning-sign",
            intent: Intent.DANGER,
            message: "Something went wrong.",
          });
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        toastRef.current.show({
          icon: "warning-sign",
          intent: Intent.DANGER,
          message: "Something went wrong.",
        });
      });
  };
  return (
    <Card elevation="1">
      <Toaster
        ref={toastRef}
        autoFocus={false}
        canEscapeKeyClear={true}
        position={Position.TOP}
        usePortal={true}
      />
      <H2>Send Push Notification</H2>
      <form className="notification-form" onSubmit={formSubmitHandler}>
        <FormGroup label="Notification Title" labelFor="title">
          <InputGroup
            id="title"
            placeholder="Notification Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Notification Body" labelFor="body">
          <InputGroup
            id="body"
            placeholder="Notification Body"
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Additional Data" labelFor="data">
          <TextArea
            growVertically={true}
            large={true}
            placeholder="Additional data in JSON"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="bp3-fill"
          />
        </FormGroup>
        <FormGroup label="Send To" labelFor="data">
          <HTMLSelect
            fill
            options={recipients}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </FormGroup>
        <Button
          intent="primary"
          fill
          type="submit"
          text={isSubmitting ? "Sending" : "Send"}
        />
      </form>
    </Card>
  );
}
export default App;
