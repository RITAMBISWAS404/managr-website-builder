import { Navigate, Route, Routes } from "react-router-dom";
import { ManagRShell } from "@/components/layout/ManagRShell";
import { DevBar } from "@/components/layout/DevBar";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { WebsiteHome } from "@/features/home/WebsiteHome";
import { AvailabilityScreen } from "@/features/inventory/AvailabilityScreen";
import { VisitsScreen } from "@/features/visits/VisitsScreen";
import { EnquiriesScreen } from "@/features/enquiries/EnquiriesScreen";
import { BookingsScreen } from "@/features/bookings/BookingsScreen";
import { AnalyticsScreen } from "@/features/analytics/AnalyticsScreen";
import { PlanScreen } from "@/features/plan/PlanScreen";
import { UpgradeScreen } from "@/features/plan/UpgradeScreen";
import { HealthScreen } from "@/features/health/HealthScreen";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { ScheduledVisitsScreen } from "@/features/visits/ScheduledVisitsScreen";
import { EditorScreen } from "@/features/editor/EditorScreen";
import { VisitorSite } from "@/features/visitor/VisitorSite";

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/website" replace />} />

        {/* full-screen surfaces (no ManagR shell) */}
        <Route path="/website/editor" element={<EditorScreen />} />
        <Route path="/website/preview" element={<VisitorSite />} />

        {/* everything else lives inside the ManagR shell */}
        <Route element={<ManagRShell />}>
          <Route path="/website" element={<WebsiteHome />} />
          <Route path="/website/availability" element={<AvailabilityScreen />} />
          <Route path="/website/visits" element={<VisitsScreen />} />
          <Route path="/website/enquiries" element={<EnquiriesScreen />} />
          <Route path="/website/bookings" element={<BookingsScreen />} />
          <Route path="/website/analytics" element={<AnalyticsScreen />} />
          <Route path="/website/plan" element={<PlanScreen />} />
          <Route path="/website/upgrade" element={<UpgradeScreen />} />
          <Route path="/website/health" element={<HealthScreen />} />
          <Route path="/website/settings" element={<SettingsScreen />} />
          <Route path="/scheduled-visits" element={<ScheduledVisitsScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/website" replace />} />
      </Routes>

      <DevBar />
    </ErrorBoundary>
  );
}
