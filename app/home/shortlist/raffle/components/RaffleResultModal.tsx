//Modal.tsx
import React from "react";
import cn from "classnames";
type Props = {
  children: React.ReactNode;
  open: boolean;
};

const RaffleResultModal = ({ children, open }: Props) => {
  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });
  return (
    <div className={modalClass}>
      <div className="modal-box flex flex-col items-center">{children}</div>
    </div>
  );
};

export default RaffleResultModal;