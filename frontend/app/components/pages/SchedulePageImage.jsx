import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import ScheduleTable from "../features/ScheduleTable";

export default function schedule() {
    return (
        <div className="text-center">
            <div className="h-screen relative inline-block mx-auto">
                <img
                    src="/bv-courts.png"
                    className="size-full object-cover"
                />
                <div className="absolute left-0 right-0 top-0 h-5/12 grid grid-cols-2">
                    <div className="bg-white/20 m-4 flex flex-col"></div>
                    <div className="bg-white/15 m-4"></div>
                </div>
                <div className="absolute   left-0 right-0 bottom-0 h-7/12 grid grid-cols-3">
                    <div className="bg-white/15 m-4 z-0 flex items-center justify-center">
                        <div className="flex flex-col gap-2 z-50">
                            <Button variant="base-100">18:00 - 19:00</Button>
                            <Button variant="base-100">18:00 - 19:00</Button>
                            <Button variant="base-100">18:00 - 19:00</Button>
                            <Button variant="base-100">18:00 - 19:00</Button>
                        </div>
                    </div>
                    <div className="bg-white/15 m-4"></div>
                    <div className="bg-white/15 m-4"></div>
                </div>
            </div>
        </div>
    );
}
