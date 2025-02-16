"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function SaveQueryDialog({ isOpen, onClose, onSave }) {
  const [queryName, setQueryName] = useState("")

  function handleSave() {
    onSave(queryName)
    setQueryName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Query</DialogTitle>
        </DialogHeader>
        <Input placeholder="Enter query name" value={queryName} onChange={(e) => setQueryName(e.target.value)} />
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

