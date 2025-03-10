import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cartContext";

export function SyncModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (show: boolean) => void }) {
  const { syncCart } = useCart();

  function handleConfirmation() {
    syncCart();
    setShowModal(false);
  }

  function handleDeny() {
    localStorage.removeItem("localCart");
    setShowModal(false);
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Cart</DialogTitle>
          <DialogDescription>Do you want to save the cart changes?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirmation}>Yes</Button>
          <Button onClick={handleDeny}>No</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
