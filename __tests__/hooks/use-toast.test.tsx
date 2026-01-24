"use client"

import { renderHook, act } from "@testing-library/react"

import { toast, useToast, __testing } from "@/hooks/use-toast"

describe("useToast", () => {
  it("registers a single listener across state updates", () => {
    const pushSpy = jest.spyOn(__testing.listeners, "push")
    const { unmount } = renderHook(() => useToast())

    expect(pushSpy).toHaveBeenCalledTimes(1)

    act(() => {
      toast({ title: "hello" })
    })

    expect(pushSpy).toHaveBeenCalledTimes(1)

    unmount()
  })
})
