import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useKillScrollTriggersOnUnmount() {
  useLayoutEffect(() => {
    return () => {
      // pin/spacer/inline style까지 원복(revert)하면서 제거
      ScrollTrigger.getAll().forEach((st) => st.kill(true));
      ScrollTrigger.clearScrollMemory();

      // 혹시 남아있는 tween도 정리(안정성)
      gsap.killTweensOf("*");
    };
  }, []);
}
