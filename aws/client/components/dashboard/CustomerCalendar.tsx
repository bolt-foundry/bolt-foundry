import { React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";

const { useEffect, useState } = React;

const customerTEMP = [
  "Tiny Cupboard",
  "Blue Ridge",
  "The Bell House",
  "The Sultan Room",
  "The Broadway",
  "The Bowery Electric",
];

export default function CustomerCalendar() {
  return (
    <div className="dashboardSection">
      <div className="dashboardHeader">Calendar</div>
      <div className="calendarGrid">
        <div className="calendarHeader left">Customer</div>
        <div className="calendarHeader">
          Monday<div className="calendarDate">2/12</div>
        </div>
        <div className="calendarHeader">
          Tuesday<div className="calendarDate">2/13</div>
        </div>
        <div className="calendarHeader">
          Wednesday<div className="calendarDate">2/14</div>
        </div>
        <div className="calendarHeader">
          Thursday<div className="calendarDate">2/15</div>
        </div>
        <div className="calendarHeader">
          Friday<div className="calendarDate">2/16</div>
        </div>
        {customerTEMP.map((customer) => (
          <React.Fragment key={customer}>
            <div className="customerName">{customer}</div>
            {[...Array(5)].map((_, i) => {
              const selectedTEMP = [...Array(3)].map((_) => {
                return Math.floor(Math.random() * 2) === 1;
              });
              return (
                <div className="calendarSocial" key={i}>
                  <Button
                    kind={selectedTEMP[0] ? "filledSuccess" : "outline"}
                    iconLeft="brand-instagram"
                    size="medium"
                  />
                  <Button
                    kind={selectedTEMP[1] ? "filledSuccess" : "outline"}
                    iconLeft="brand-facebook"
                    size="medium"
                  />
                  <Button
                    kind={selectedTEMP[2] ? "filledSuccess" : "outline"}
                    iconLeft="brand-tiktok"
                    size="medium"
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
