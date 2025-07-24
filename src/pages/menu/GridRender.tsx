import React, { useState, forwardRef, HTMLAttributes, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { InView } from "react-intersection-observer";

interface GridWithShadowsProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onScroll?(s: boolean): void;
}

const Scroller = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    setShowTopShadow: (s: boolean) => void;
  }
>(({ style, setShowTopShadow, children, ...props }, ref) => {
  return (
    <div ref={ref} style={{ ...style }} {...props} className="scroll-hidden">
      <InView
        rootMargin="0px"
        threshold={0}
        onChange={(inView) => setShowTopShadow(!inView)}
      >
        <div />
      </InView>

      {children}
    </div>
  );
});

export default function GridWithShadows<T>({
  items,
  renderItem,
  ...props
}: GridWithShadowsProps<T>) {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  const FooterSentinel = () => (
    <InView
      rootMargin="0px"
      threshold={0}
      onChange={(inView) => {
        setShowBottomShadow(!inView);
        props.onScroll?.(!inView);
      }}
    >
      <div className="h-1" />
    </InView>
  );

  const virtuosoComponents = useMemo(
    () => ({
      Scroller: (propsS: any) => (
        <Scroller
          {...propsS}
          setShowTopShadow={(s) => {
            setShowTopShadow(s);
            props.onScroll?.(s);
          }}
        />
      ),
      Footer: FooterSentinel,
    }),
    []
  );

  return (
    <div className="h-full">
      <div
        className={`pointer-events-none absolute left-0 z-30 h-[70px] w-full`}
        style={{
          background: "linear-gradient(rgba(255, 255, 255, 1), transparent)",
          opacity: Number(showTopShadow),
          top: 0,
        }}
      />
      <VirtuosoGrid
        style={{ height: "100%" }}
        totalCount={items.length}
        overscan={200}
        listClassName="grid w-full grid-cols-4 auto-rows-[126px]"
        components={virtuosoComponents}
        itemContent={(index) => renderItem(items[index], index)}
      />

      <div
        className={`pointer-events-none absolute left-0 z-30 h-[100px] w-full`}
        style={{
          background: "linear-gradient(transparent, rgb(255, 255, 255))",
          opacity: Number(showBottomShadow),
          bottom: 0,
        }}
      />
    </div>
  );
}
