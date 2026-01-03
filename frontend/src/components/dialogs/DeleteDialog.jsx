import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components"
import { Loader2 } from "lucide-react"

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Delete Item",
  description = "Are you sure you want to delete this item?",
  itemName,
  itemId,
  onConfirm,
  isLoading = false,
  children
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-96 md:max-w-md lg:max-w-md rounded-xl p-12">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {children || (
            <>
              <p className="text-sm text-muted-foreground">
                This will permanently delete {itemName && <span className="font-semibold">{itemName}</span>}
                {itemId && <> (ID: {itemId})</>} from the database.
              </p>
              <p className="text-sm text-red-700 mt-2">
                This action cannot be undone.
              </p>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-center gap-3">
          <Button size="lg" variant="outline" className="" onClick={() => onOpenChange(false)} disabled={isLoading} >
            Cancel
          </Button>
          <Button size="lg" variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
