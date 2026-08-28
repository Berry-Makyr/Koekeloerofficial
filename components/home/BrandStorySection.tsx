'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Compass, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image Collage */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-[4/5] bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg"
                  alt="Koekeloer Gansbaai Geskenkwinkel Vertoonlokaal"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-square bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fb-images/618282172_25073502085661944_8993232252802069912_n.jpg"
                  alt="Kuslyn Seildoekkuns by Koekeloer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-square bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg"
                  alt="Balinese Gebrandskilderde Meubels"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-[4/5] bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fb-images/615057225_24998643253147828_5505068522394442945_n.jpg"
                  alt="Koekeloer Boetiek Linne Drag"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-coastal-900 text-sand-100 p-5 rounded-2xl shadow-xl text-center border-4 border-sand-50">
              <span className="block font-serif text-3xl font-bold text-white">40+</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-sand-300">
                Years of Retail Heritage
              </span>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
                Ons Storie • Since 2012
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-driftwood-950 leading-tight">
                ‘n Reis van Ontdekking in die Overberg
              </h2>
            </div>

            <p className="text-sm sm:text-base text-driftwood-700 leading-relaxed">
              In 2012 open <strong>Koekeloer</strong> sy deure by die Great White Junction in Gansbaai. Gestig deur Nelia Koekemoer met vier dekades se kleinhandelpassie, het ons 'n leefstyl-emporium geskep waar elke hoekie iets besonders openbaar.
            </p>

            <p className="text-sm sm:text-base text-driftwood-700 leading-relaxed">
              Die uniekheid van ons winkel is die wye verskeidenheid van produkte. Behalwe dat ons voorsien aan die gesofistikeerde koper, bedien ons ook <em>Jan Alleman</em> met items wat warmte, elegansie en karakter na elke tuiste bring.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Direkte Bali Invoere</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Teakhout, rivierklip wasbakke en rotang meubels direk vanaf ateljees.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">4 Fisiese Winkels</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Winkels regoor Gansbaai, Bredasdorp, Struisbaai & Pearly Beach.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Savoy Skoene & Boetiek</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Volledige damesboetiek met suiwer linne somerdrag en geriefsandale.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Gemeenskapsondersteuning</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Gereelde ondersteuning aan plaaslike Overberg ouetehuise en liefdadigheid.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 transition"
              >
                <span>Lees Ons Volledige Storie</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/stores"
                className="bg-white hover:bg-sand-100 text-driftwood-900 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-sand-300 transition"
              >
                <span>Besoek Ons Winkels</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
