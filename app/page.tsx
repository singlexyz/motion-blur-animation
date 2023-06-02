"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { animated, useSpring, config } from "@react-spring/web"
import { forwardRef, useId, useImperativeHandle, useRef } from "react"
import { createPortal } from "react-dom"

const AnimatedCard = animated(Card)

type MotionFilterProps = {
  children: (filter: string) => React.ReactNode
}

const MotionFilter = forwardRef(function MotionFilter(
  { children }: MotionFilterProps,
  ref
) {
  const id = useId()
  const filter = `url(#${id})`
  const filterRef = useRef<SVGFEGaussianBlurElement>(null)
  useImperativeHandle(ref, () => ({
    update(x: number, y: number) {
      if (filterRef.current) {
        filterRef.current.setAttribute("stdDeviation", `${x},${y}`)
      }
    }
  }))
  return (
    <>
      {createPortal(
        <svg className="w-0 h-0 absolute">
          <defs>
            <filter id={id}>
              <feGaussianBlur
                ref={filterRef}
                in="SourceGraphic"
                stdDeviation="0,0"
              />
            </filter>
          </defs>
        </svg>,
        document.body,
        id
      )}
      {children(filter)}
    </>
  )
})

export default function Home() {
  const styles = useSpring({
    from: {
      opacity: 0,
      x: "-100vh"
    },
    to: {
      opacity: 1,
      x: "0vh"
    },
    config: config.gentle,
    onChange(_, { springs }) {
      if (ref.current) {
        ref.current.update(0, Math.abs(springs.x.velocity * 200))
      }
    },
    onResolve() {
      if (ref.current) {
        ref.current.update(0, 0)
      }
    }
  })
  const ref = useRef<{ update: (x: number, y: number) => void }>(null)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 overflow-hidden">
      <MotionFilter ref={ref}>
        {(filter) => (
          <AnimatedCard style={{ ...styles, filter }} className="w-[360px]">
            <CardHeader>
              <CardTitle className="tracking-wider">创造世界</CardTitle>
              <CardDescription>轻而易举地创作出你的最爱</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" placeholder="你连你是谁都不知道？" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="status">状态</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="职业" />
                        <SelectContent position="popper">
                          <SelectItem value="next">学生</SelectItem>
                          <SelectItem value="sveltekit">教师</SelectItem>
                          <SelectItem value="astro">员工</SelectItem>
                          <SelectItem value="nuxt">管理</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">离开，我不配</Button>
              <Button className="tracking-widest">登录</Button>
            </CardFooter>
          </AnimatedCard>
        )}
      </MotionFilter>
    </main>
  )
}
