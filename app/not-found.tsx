"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="relative mx-auto w-64 h-64">
          {/* SVG illustration for 404 page */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
            <g>
              <path
                fill="#f2f2f2"
                d="M413.94,233.9c0,60.4-35.82,108.75-87.92,108.75S238.1,294.3,238.1,233.9c0-60.4,35.82-108.75,87.92-108.75S413.94,173.5,413.94,233.9Z"
              />
              <path
                fill="#f2f2f2"
                d="M261.88,233.9c0,60.4-35.82,108.75-87.92,108.75S86.04,294.3,86.04,233.9c0-60.4,35.82-108.75,87.92-108.75S261.88,173.5,261.88,233.9Z"
              />
              <circle cx="200" cy="233.9" r="108.75" fill="#8b5cf6" />
              <path
                fill="#fff"
                d="M168.5,165.9c-1.79,0-3.25,1.46-3.25,3.25v65c0,1.79,1.46,3.25,3.25,3.25h65c1.79,0,3.25-1.46,3.25-3.25v-65c0-1.79-1.46-3.25-3.25-3.25h-65Z"
              />
              <path
                fill="#fff"
                d="M168.5,230.65v6.5c0,1.79,1.46,3.25,3.25,3.25h65c1.79,0,3.25-1.46,3.25-3.25v-6.5h-71.5Z"
              />
              <path
                fill="#8b5cf6"
                d="M300,165.9c-1.79,0-3.25,1.46-3.25,3.25v65c0,1.79,1.46,3.25,3.25,3.25h65c1.79,0,3.25-1.46,3.25-3.25v-65c0-1.79-1.46-3.25-3.25-3.25h-65Z"
              />
              <path
                fill="#8b5cf6"
                d="M300,230.65v6.5c0,1.79,1.46,3.25,3.25,3.25h65c1.79,0,3.25-1.46,3.25-3.25v-6.5h-71.5Z"
              />
              <path
                fill="#fff"
                d="M200,275.9c-23.2,0-42-18.8-42-42s18.8-42,42-42,42,18.8,42,42-18.8,42-42,42Zm0-78c-19.85,0-36,16.15-36,36s16.15,36,36,36,36-16.15,36-36-16.15-36-36-36Z"
              />
              <path
                fill="#fff"
                d="M200,260.9c-14.91,0-27-12.09-27-27s12.09-27,27-27,27,12.09,27,27-12.09,27-27,27Zm0-48c-11.6,0-21,9.4-21,21s9.4,21,21,21,21-9.4,21-21-9.4-21-21-21Z"
              />
              <path fill="#8b5cf6" d="M200,245.9c-6.63,0-12-5.37-12-12s5.37-12,12-12,12,5.37,12,12-5.37,12-12,12Z" />
            </g>
            <g>
              <path
                fill="#3f3d56"
                d="M169.5,347.52h-41.25v-3.22c0-11.16,9.09-20.25,20.25-20.25h0c11.16,0,20.25,9.09,20.25,20.25v3.22Z"
              />
              <rect x="171.25" y="346.27" width="41.25" height="3.5" fill="#3f3d56" />
              <path
                fill="#3f3d56"
                d="M288.75,346.27h-41.25v-3.22c0-11.16,9.09-20.25,20.25-20.25h0c11.16,0,20.25,9.09,20.25,20.25v3.22Z"
              />
              <rect x="290.5" y="346.27" width="41.25" height="3.5" fill="#3f3d56" />
            </g>
            <text x="250" y="400" textAnchor="middle" fontSize="60" fontWeight="bold" fill="#3f3d56">
              404
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600">Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
            Go Back
          </Button>
          <Button asChild className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            <Link href="/">Return to HomePage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
