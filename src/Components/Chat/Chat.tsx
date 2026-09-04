import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik, type FormikHelpers } from "formik";
import * as Yup from "yup";

import { themes } from "../../theme/theme";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import Friends from "../Friends/Friends";
import ChatWindow from "../ChatWindow/ChatWindow";

import "./Chat.css";
import { socket } from "../../services/socket/socket";
import type { IFormValues, IFriend, IMessage } from "../../types/types";
import { uploadChatAttachments } from "../../redux/features/chat";
import type { User } from "../../redux/features/auth";

const initialValues: IFormValues = {
  text: "",
};

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState<IFriend | null>(null);

  const [message, setMessage] = useState<IMessage[]>([]);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Selected files before sending
  const [attachments, setAttachments] = useState<File[]>([]);

  const { activeTheme } = useAppSelector((state) => state.theme);

  const { user } = useAppSelector((state) => state.auth);
  const { uploadingAttachments } = useAppSelector((state) => state.chat);

  const currentTheme = themes[activeTheme] || themes["light"];
  const dispatch = useAppDispatch();
  /*
   * Join private chat
   */
  useEffect(() => {
    if (!selectedFriend) return;

    // Clear previous selected attachments

    socket.emit("join-private-chat", selectedFriend._id);

    socket.emit("get-chat-history", selectedFriend._id);
  }, [selectedFriend]);

  /*
   * Chat history
   */
  useEffect(() => {
    const handleChatHistory = (messages: IMessage[]) => {
      if (!Array.isArray(messages)) {
        console.error("chat-history is not an array:", messages);

        return;
      }

      setMessage(messages);
    };

    socket.on("chat-history", handleChatHistory);

    return () => {
      socket.off("chat-history", handleChatHistory);
    };
  }, []);

  /*
   * New message
   */
  useEffect(() => {
    const handleMessage = (newMessage: IMessage) => {
      setMessage((prev) => [...prev, newMessage]);
    };

    socket.on("message-sent", handleMessage);

    return () => {
      socket.off("message-sent", handleMessage);
    };
  }, []);

  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      console.log("online users:", users);

      setOnlineUsers(users);
    };

    const handleConnect = () => {
      console.log("socket connected:", socket.id);

      socket.emit("get-online-users");
    };

    const handleDisconnect = () => {
      console.log("socket disconnected");
    };

    const handleConnectError = (error: Error) => {
      console.error("socket connection error:", error.message);
    };

    socket.on("online-users", handleOnlineUsers);

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit("get-online-users");
    }

    return () => {
      socket.off("online-users", handleOnlineUsers);

      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("connect_error", handleConnectError);
    };
  }, []);

  /*
   * Submit message
   */
  const onSubmit = async (
    values: IFormValues,
    { resetForm }: FormikHelpers<IFormValues>,
  ) => {
    // Don't send if there is no text and no files
    if (!values.text.trim() && attachments.length === 0) {
      return;
    }

    let uploadedAttachments: {
      secure_url: string;
      public_id: string;
    }[] = [];

    if (attachments.length > 0) {
      uploadedAttachments = await dispatch(
        uploadChatAttachments(attachments),
      ).unwrap();
    }

    socket.emit("sent-private-message", {
      text: values.text.trim(),

      targetUserId: selectedFriend?._id,

      // Temporary:
      // later we will upload these files
      // and send the returned URLs instead.
      attachments: uploadedAttachments,
    });

    resetForm();

    // Clear selected files after sending
    setAttachments([]);
  };

  /*
   * Validation
   *
   * Text is NOT required because
   * attachment-only messages are allowed.
   */
  const validationSchema = Yup.object({
    text: Yup.string(),
  });

  const formik = useFormik({
    initialValues,

    validationSchema,

    onSubmit,
  });

  return (
    <Box
      sx={{
        height: "100vh",
        "@supports (height: 100dvh)": {
          height: "100dvh",
        },
        width: "100%",
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",

        display: "flex",

        backgroundColor: "background.default",

        overflow: "hidden",
      }}
    >
      {/* Friends Sidebar */}

      <Friends
        currentTheme={currentTheme}
        selectedFriend={selectedFriend}
        onSelectFriend={setSelectedFriend}
        onlineUsers={onlineUsers}
      />

      {/* Chat Area */}

      <Box
        sx={{
          display: {
            xs: selectedFriend ? "flex" : "none",
            sm: "flex",
          },
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {selectedFriend ? (
          <ChatWindow
            user={selectedFriend}
            currentTheme={currentTheme}
            formik={formik}
            currentUser={user as User}
            messages={message}
            attachments={attachments}
            setAttachments={setAttachments}
            uploadingAttachments={uploadingAttachments}
            setSelectedFriend={setSelectedFriend}
            isOnline={onlineUsers.includes(selectedFriend._id)}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              minWidth: 0,
              p: 2,
              boxSizing: "border-box",
              textAlign: "center",

              display: "flex",

              flexDirection: "column",

              justifyContent: "center",

              alignItems: "center",

              gap: 1,

              color: "text.secondary",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 800,
              }}
            >
              Your messages
            </Typography>

            <Typography>Select a friend to start chatting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
