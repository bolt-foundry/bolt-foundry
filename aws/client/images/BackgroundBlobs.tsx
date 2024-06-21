import { React } from "aws/client/deps.ts";

const styles: Record<string, React.CSSProperties> = {
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    width: "100%",
    height: "100%",
  },
};

export default function TVStatic() {
  const gradStart = "var(--secondaryColor)";
  const gradEnd = "var(--fourtharyColor)";
  return (
    <div style={styles.bg}>
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="50 230 540 350"
        xmlSpace="preserve"
      >
        <style type="text/css">
          {`
          .st0{fill:url(#SVGID_1_);}
          .st1{fill:url(#SVGID_00000096019028139706214330000011219524216970947991_);}
          .st2{fill:url(#SVGID_00000123432224065319274720000010483871882885971109_);}
          .st3{fill:#60696E;}
          .st4{fill:#4F595B;}
          .st5{fill:#152D35;}
          .st6{fill:#E0E0E0;}
          .st7{fill:#1E2437;}
          .st8{fill:#444E63;}
          .st9{fill:#787E91;}
          .st10{fill:#FFFFFF;}
        `}
        </style>
        <g>
          <linearGradient
            id="SVGID_1_"
            gradientUnits="userSpaceOnUse"
            x1="-2.055731e-08"
            y1="3.485275e-08"
            x2="1"
            y2="3.485275e-08"
            gradientTransform="matrix(437.8195 0 0 437.8195 111.6105 356.6633)"
          >
            <stop offset="0" style={{ stopColor: gradStart }} />
            <stop offset="1" style={{ stopColor: gradEnd }} />
          </linearGradient>
          <path
            className="st0"
            d="M529.72,415.36h-44.8v39.4h44.8c5.22-0.02,10.23-2.1,13.92-5.8c3.69-3.69,5.77-8.7,5.79-13.92
		c-0.03-5.22-2.11-10.21-5.8-13.9C539.94,417.46,534.94,415.38,529.72,415.36 M158.41,415.35h-27.12
		c-5.16,0.1-10.07,2.23-13.68,5.91c-3.61,3.68-5.63,8.64-5.63,13.8c0,5.16,2.02,10.11,5.63,13.8c3.61,3.68,8.52,5.81,13.68,5.91
		h27.12V415.35 M158.41,337.38h-27.13c-4.72,0.01-9.28,1.71-12.85,4.8c-3.57,3.09-5.91,7.35-6.61,12.02
		c-0.69,4.67,0.31,9.43,2.83,13.42c1.88,2.97,4.51,5.37,7.59,6.97c1.74,0.9,3.67,1.35,5.63,1.35h30.53V337.38 M529.72,337.38h-44.8
		v39.26l39.39,0.15h5.41c5.16-0.1,10.07-2.22,13.68-5.91c3.61-3.68,5.63-8.64,5.63-13.8c0-5.16-2.02-10.11-5.63-13.8
		C539.79,339.61,534.88,337.49,529.72,337.38 M441.46,258.56H219.54c-5.16,0.1-10.07,2.22-13.68,5.91
		c-3.53,3.6-5.54,8.41-5.63,13.43h260.55c-0.09-5.03-2.11-9.84-5.63-13.43C451.53,260.78,446.62,258.66,441.46,258.56"
          />

          <linearGradient
            id="SVGID_00000148658947657315727900000006555208947728073374_"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="9.094947e-13"
            x2="1"
            y2="9.094947e-13"
            gradientTransform="matrix(40.275 0 0 40.275 152.7026 278.6743)"
          >
            <stop offset="0" style={{ stopColor: gradEnd }} />
            <stop offset="1" style={{ stopColor: gradStart }} />
          </linearGradient>
          <circle
            style={{
              fill:
                "url(#SVGID_00000148658947657315727900000006555208947728073374_)",
            }}
            cx="172.84"
            cy="278.67"
            r="20.14"
          />

          <linearGradient
            id="SVGID_00000165209718720033025240000015749598582480117694_"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="matrix(40.275 0 0 40.275 61.8743 436.3306)"
          >
            <stop offset="0" style={{ stopColor: gradEnd }} />
            <stop offset="1" style={{ stopColor: gradStart }} />
          </linearGradient>
          <circle
            style={{
              fill:
                "url(#SVGID_00000165209718720033025240000015749598582480117694_)",
            }}
            cx="82.01"
            cy="436.33"
            r="20.14"
          />
        </g>
      </svg>
    </div>
  );
}
