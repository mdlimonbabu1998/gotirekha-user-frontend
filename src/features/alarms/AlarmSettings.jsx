import { CheckCircle2, Mail, Save } from "lucide-react";
import { useState } from "react";

export default function AlarmSettings() {
  const [savedMessage, setSavedMessage] = useState(false);

  // List of user alarm notification preferences with editable custom email fields
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "proraider@proraider.com",
      alarmType: "Geofence Alarm (Radius)",
      emailAlert: false,
      pushNotification: true,
    },
    {
      id: 2,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "alerts.admin@proraider.com",
      alarmType: "Engine On/Off Alarm",
      emailAlert: false,
      pushNotification: true,
    },
    {
      id: 3,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "ops@proraider.com",
      alarmType: "Overspeeding Alarm",
      emailAlert: false,
      pushNotification: true,
    },
    {
      id: 4,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "safety@proraider.com",
      alarmType: "Vibration Alarm",
      emailAlert: false,
      pushNotification: true,
    },
    {
      id: 5,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "papers@proraider.com",
      alarmType: "Paper Management",
      emailAlert: false,
      pushNotification: true,
    },
    {
      id: 6,
      name: "Personal Account null",
      role: "Organizer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      mobile: "01711297914",
      customEmail: "hardware.support@proraider.com",
      alarmType: "Device Unplugged Alarm",
      emailAlert: false,
      pushNotification: true,
    },
  ]);

  // Handle typing in custom email input per row
  const handleEmailChange = (id, value) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, customEmail: value } : item,
      ),
    );
  };

  // Toggle individual row's email alert
  const toggleEmail = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, emailAlert: !item.emailAlert } : item,
      ),
    );
  };

  // Toggle individual row's push notification
  const togglePush = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, pushNotification: !item.pushNotification }
          : item,
      ),
    );
  };

  // Global toggle all email alerts
  const toggleAllEmails = () => {
    const allChecked = notifications.every((i) => i.emailAlert);
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, emailAlert: !allChecked })),
    );
  };

  // Global toggle all push notifications
  const toggleAllPush = () => {
    const allChecked = notifications.every((i) => i.pushNotification);
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, pushNotification: !allChecked })),
    );
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title & Save Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>

          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Preferences</span>
          </button>
        </div>

        {savedMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Notification settings updated successfully!</span>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex space-x-8">
            <button className="pb-3 text-xs font-bold text-orange-500 border-b-2 border-orange-500 cursor-pointer">
              SMS, Email, Push
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Table without filter bar */}
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-600 bg-gray-50/50">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Mobile Number</th>
                    <th className="py-3 px-4">Custom Email Destination</th>
                    <th className="py-3 px-4">Alarm Type</th>

                    {/* Global Email Header Toggle */}
                    <th className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={toggleAllEmails}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            notifications.every((i) => i.emailAlert)
                              ? "bg-gray-700"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications.every((i) => i.emailAlert)
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span>Email Alert</span>
                      </div>
                    </th>

                    {/* Global Push Header Toggle */}
                    <th className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={toggleAllPush}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            notifications.every((i) => i.pushNotification)
                              ? "bg-orange-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications.every((i) => i.pushNotification)
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span>Push Notificat...</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {notifications.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/80 transition-all"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 leading-tight">
                              {row.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-normal">
                              {row.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-gray-600">
                        {row.mobile}
                      </td>

                      {/* Custom Email Input Field */}
                      <td className="py-3 px-4">
                        <div className="relative flex items-center">
                          <Mail
                            size={14}
                            className="absolute left-3 text-gray-400 pointer-events-none"
                          />
                          <input
                            type="email"
                            value={row.customEmail}
                            onChange={(e) =>
                              handleEmailChange(row.id, e.target.value)
                            }
                            placeholder="Enter custom email..."
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 rounded-lg py-1.5 pl-9 pr-3 text-xs text-gray-800 outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-gray-800">
                        {row.alarmType}
                      </td>

                      {/* Email Alert Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleEmail(row.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            row.emailAlert ? "bg-gray-700" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              row.emailAlert ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Push Notification Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePush(row.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            row.pushNotification
                              ? "bg-orange-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              row.pushNotification
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
