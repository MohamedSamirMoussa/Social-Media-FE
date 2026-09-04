import type { FormikValues } from "formik";
import type { IThemeProps } from "../redux/features/theme";
import type { User } from "../redux/features/auth";

export interface IAttachments {
  public_id: string;
  secure_url: string;
}

export interface IMessage {
  _id: string;
  text: string;
  conversationId: string;
  senderId: string;
  createdAt: string;
  attachments?: IAttachments[];
}

export interface IFormValues {
  text: string;
}

export interface IFriend {
  firstName: string;
  lastName: string;
  username: string;
  _id: string;
  profileImage?: {
    public_id: string;
    secure_url: string;
  };

  friendshipStatus?: "none" | "pending_sent" | "pending_received" | "accepted";
}

export interface ChatWindowProps {
  user: IFriend;

  currentTheme: IThemeProps;

  currentUser: User;

  formik: FormikValues;

  messages: IMessage[];

  attachments: File[];

  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  setSelectedFriend: React.Dispatch<React.SetStateAction<IFriend | null>>;

  uploadingAttachments: boolean;
  isOnline: boolean;
}

export interface FriendsProps {
  currentTheme: IThemeProps;
  selectedFriend: IFriend | null;
  onSelectFriend: (friend: IFriend) => void;
  onlineUsers: string[];
}

export interface ICommentOwner {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;

  profileImage?: {
    secure_url: string;
    public_id: string;
  };
}

export interface IComment {
  _id: string;
  content: string;
  ownerId: ICommentOwner;
  refId?: string;
  onModel?: "Post" | "Comment";
  createdAt?: string;
}

export interface IFriendRequest {
  _id: string;

  requestFromId: IFriend;

  requestToId: IFriend;

  status: "pending" | "accepted" | "rejected";
}
