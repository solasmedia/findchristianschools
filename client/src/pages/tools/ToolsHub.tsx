import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ToolsHub() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/teacher-resources");
  }, []);
  return null;
}
