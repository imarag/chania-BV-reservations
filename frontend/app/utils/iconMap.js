// iconsMap.js
import { LuUserRound, LuUser, LuSearch, LuIdCard } from "react-icons/lu";
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
};

export function getIcon(name, fallback = LuUser) {
  return iconMap[name] || fallback;
}
