// iconsMap.js
import { LuUserRound, LuUser, LuSearch, LuIdCard } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { TiInfoOutline } from "react-icons/ti";
import { GoInfo } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import {
  MdAlternateEmail,
  MdOutlineLocalPhone,
  MdOutlineBusinessCenter,
} from "react-icons/md";
import { BiHome } from "react-icons/bi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

export const iconMap = {
  full_name: LuIdCard,
  email: MdAlternateEmail,
  phone_number: MdOutlineLocalPhone,
  role: LuUser,
  address: BiHome,
  profession: MdOutlineBusinessCenter,
  date_of_birth: LiaBirthdayCakeSolid,
  search: LuSearch,
  user_label: LuUserRound,
  close: IoClose,
  success: FaRegCircleCheck,
  check: FaRegCircleCheck,
  error: MdErrorOutline,
  critical: MdErrorOutline,
  info: GoInfo,
  warning: TiInfoOutline,
};

export function getIcon(name, fallback = LuUser) {
  return iconMap[name] || fallback;
}
